import { GenezioDeploy, GenezioAuth, GnzContext } from "@genezio/types";

import data from "./data.json";
let cd = data.categories


@GenezioDeploy()
export class categories {
  constructor() {}

  async getList({pagination, sorters, filters} : {pagination: any, sorters: any, filters: any}): Promise<any> {
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

  async getOne({id}: {id: number}): Promise<any> {
    return {data: cd.find((item) => item.id == id), total: 1};
  }
  
  @GenezioAuth()
  async create(context: GnzContext, {title}: {title: string}): Promise<any> {
    console.log("User: ", context.user?.email, " created a category");
    cd.push({id: cd.length + 1, title});
    return cd.find((item) => item.id == cd.length);
  }

  @GenezioAuth()
  async update(context: GnzContext, {id, title}: {id: number, title: string}): Promise<any> {
    console.log("User: ", context.user?.email, " updated a category");
    const index = cd.findIndex((item) => item.id == id);
    if (index === -1) throw new Error("Not found");
    cd[index].title = title;
    return cd[index];
  }

  @GenezioAuth()
  async deleteOne(context: GnzContext, {id}: {id: number}): Promise<any> {
    console.log("User: ", context.user?.email, " deleted a category");
    const index = cd.findIndex((item) => item.id == id);
    if (index === -1) throw new Error("Not found");
    cd.splice(index, 1);
    return true;
  }
}