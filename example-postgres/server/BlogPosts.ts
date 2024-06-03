import { GenezioDeploy, GenezioAuth, GnzContext } from "@genezio/types";
import { IDataProviderService, DataProviderListParams, DataProviderResponse } from "./DataProvider";
import pg from 'pg';
const { Pool } = pg;

type BlogPost = {
  id?: number;
  title: string;
  content: string;
  author_id?: number;
  author_name?: string;
  category_ids?: number[];
  status: string;
  created_at: string;
};

@GenezioDeploy()
export class BlogPosts implements IDataProviderService<BlogPost> {
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
      `CREATE TABLE IF NOT EXISTS blog_posts (
        id serial PRIMARY KEY,
        title VARCHAR(255),
        content TEXT,
        author_id INT,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );

    await this.pool.query(
      `CREATE TABLE IF NOT EXISTS blog_post_categories (
        blog_post_id INT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
        category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE
      )`
    );
  }

  async getList(context: GnzContext, { pagination, sorters, filters }: DataProviderListParams) {
    let query = "SELECT blog_posts.*, authors.name as author_name FROM blog_posts left join authors on blog_posts.author_id = authors.id";
    let conditions:string[] = [];
    let params:any[] = [];

    if (filters && filters.length > 0) {
      filters.forEach((filter: any) => {
        if (filter.field && filter.operator === "contains" && filter.value) {
          conditions.push(`LOWER(${filter.field}) LIKE LOWER($${params.length + 1})`);
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

    const { current, pageSize } = pagination;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(pageSize, (current - 1) * pageSize);

    const result = await this.pool.query(query, params);
    const totalResult = await this.pool.query("SELECT COUNT(*) FROM blog_posts");

    return { data: result.rows, total: parseInt(totalResult.rows[0].count, 10) };
  }

  async getOne(context: GnzContext, id: number) {
    const result = await this.pool.query("SELECT blog_posts.*, authors.name as author_name FROM blog_posts left join authors on blog_posts.author_id=authors.id WHERE blog_posts.id = $1", [id]);
    const categories = await this.pool.query("SELECT category_id FROM blog_post_categories WHERE blog_post_id=$1", [id]);
    result.rows[0].category_ids = categories.rows.map((c: any) => c.category_id);
    return { data: result.rows[0], total: 1 };
  }

  @GenezioAuth()
  async create(context: GnzContext, bp: BlogPost) {
    const result = await this.pool.query(
      "INSERT INTO blog_posts (title, content, author_id, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [bp.title, bp.content, bp.author_id, bp.status]
    );
    // add corresponding categories
    if (bp.category_ids) {
      for (const category_id of bp.category_ids) {
        await this.pool.query(
          "INSERT INTO blog_post_categories (blog_post_id, category_id) VALUES ($1, $2)",
          [result.rows[0].id, category_id]
        );
      }
    }
    return result.rows[0];
  }

  async update(context: GnzContext, bp: BlogPost) {
    const result = await this.pool.query(
      "UPDATE blog_posts SET title = $1, content = $2, author_id = $3, status = $4 WHERE id = $5 RETURNING *",
      [bp.title, bp.content, bp.author_id, bp.status, bp.id]
    );
    if (result.rows.length === 0) throw new Error("Not found");
    // update corresponding categories
    await this.pool.query(
      "DELETE FROM blog_post_categories WHERE blog_post_id = $1",
      [bp.id]
    );
    if (bp.category_ids) {
      for (const category_id of bp.category_ids) {
        await this.pool.query(
          "INSERT INTO blog_post_categories (blog_post_id, category_id) VALUES ($1, $2)",
          [bp.id, category_id]
        );
      }
    }
    return result.rows[0];
  }

  async deleteOne(context: GnzContext, id: number) {
    const result = await this.pool.query("DELETE FROM blog_posts WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) throw new Error("Not found");
    return true;
  }
}
