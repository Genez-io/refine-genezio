import { GenezioDeploy, GenezioAuth, GnzContext } from "@genezio/types";

import data from "./data.json";
let cd = data.categories


@GenezioDeploy()
export class categories {
  constructor() {}

  async getList(): Promise<any> {
    return {data: cd, total: cd.length};
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