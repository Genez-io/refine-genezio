import { GenezioDeploy, GenezioAuth, GnzContext } from "@genezio/types";
import {IDataProviderService, DataProviderListParams} from "./DataProvider";
import pg from 'pg'
const { Pool } = pg

type Author = {
  id?: number;
  name: string;
}

@GenezioDeploy()
export class Authors implements IDataProviderService<Author>{
  pool: pg.Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env["DEMO_DATABASE_URL"],
      ssl: true,
    });
    this._init();
  }

  async _init() {
    await this.pool.query(
        "CREATE TABLE IF NOT EXISTS authors (id serial PRIMARY KEY, name VARCHAR(255))"
    );
  }

  async getList(_context: GnzContext, { pagination, sorters, filters }: DataProviderListParams) {
    const { current, pageSize } = pagination;
    let query = "SELECT * FROM authors";
    let conditions:string[] = [];
    let params:any[] = [];

    if (filters && filters.length > 0) {
      filters.forEach((filter: any) => {
        if (filter.field === "name" && filter.operator === "contains" && filter.value) {
          conditions.push(`LOWER(name) LIKE LOWER($${params.length + 1})`);
          params.push(`%${filter.value}%`);
        }
      });
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    if (sorters && sorters.length > 0) {
      const sorter = sorters[0]; // Assuming single sorter for simplicity
      const { field, order } = sorter;
      query += ` ORDER BY ${field} ${order === 'asc' ? 'ASC' : 'DESC'}`;
    }

    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(pageSize, (current - 1) * pageSize);

    const result = await this.pool.query(query, params);
    const totalResult = await this.pool.query("SELECT COUNT(*) FROM authors");

    return { data: result.rows, total: parseInt(totalResult.rows[0].count, 10) };
  }

  async getOne(_context: GnzContext, id: number) {
    const result = await this.pool.query("SELECT * FROM authors WHERE id = $1", [id]);
    return { data: result.rows[0], total: 1 };
  }

  async getMany(_context: GnzContext, ids: number[]) {
    const query = "SELECT * FROM authors WHERE id = ANY($1::int[])";
    const result = await this.pool.query(query, [ids]);
    return { data: result.rows, total: result.rows.length };
  }

  @GenezioAuth()
  async create(context: GnzContext, c: Author) {
    console.log("User: ", context.user?.email, " created a Author");
    const result = await this.pool.query(
      "INSERT INTO authors (name) VALUES ($1) RETURNING *",
      [c.name]
    );
    return result.rows[0];
  }

  @GenezioAuth()
  async update(context: GnzContext, c: Author) {
    console.log("User: ", context.user?.email, " updated a Author");
    const result = await this.pool.query(
      "UPDATE authors SET name = $1 WHERE id = $2 RETURNING *",
      [c.name, c.id]
    );
    if (result.rows.length === 0) throw new Error("Not found");
    return result.rows[0];
  }

  @GenezioAuth()
  async deleteOne(context: GnzContext, id: number) {
    console.log("User: ", context.user?.email, " deleted a Author");
    const result = await this.pool.query("DELETE FROM authors WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) throw new Error("Not found");
    return true;
  }
}
