import { GenezioDeploy, GenezioAuth, GnzContext } from "@genezio/types";
import {IDataProviderService, DataProviderListParams} from "./data-provider";
import data from "./data.json";

type Category = {
  id?: number;
  title: string;
}

let cd: Category[] = data.categories

@GenezioDeploy()
export class categories implements IDataProviderService<Category>{
  constructor() {}

  async getList(context: GnzContext, {pagination, sorters, filters} : DataProviderListParams) {
    const {current, pageSize} = pagination;
    
    // Filter the data
    let filteredData = cd;
    
    if (filters && filters.length > 0) {
      filters.forEach((filter: any) => {
        if (filter.field === "title" && filter.operator === "contains" && filter.value) {
          filteredData = filteredData.filter((item: any) =>
            item.title.toLowerCase().includes(filter.value.toLowerCase())
          );
        }
      });
    }
  
    // Apply pagination to the filtered data
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);
  
    return {data: paginatedData, total: filteredData.length};
  }

  async getOne(context: GnzContext, id: number) {
    return {data: cd.find((item) => item.id == id), total: 1};
  }
  
  @GenezioAuth()
  async create(context: GnzContext, c: Category) {
    console.log("User: ", context.user?.email, " created a category");
    c.id = cd.length + 1;
    cd.push(c);
    return cd.find((item) => item.id == cd.length);
  }

  @GenezioAuth()
  async update(context: GnzContext, c: Category) {
    console.log("User: ", context.user?.email, " updated a category");
    const index = cd.findIndex((item) => item.id == c.id);
    if (index === -1) throw new Error("Not found");
    cd[index].title = c.title;
    return cd[index];
  }

  @GenezioAuth()
  async deleteOne(context: GnzContext, id: number) {
    console.log("User: ", context.user?.email, " deleted a category");
    const index = cd.findIndex((item) => item.id == id);
    if (index === -1) throw new Error("Not found");
    cd.splice(index, 1);
    return true;
  }
}