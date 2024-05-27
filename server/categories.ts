import { GenezioDeploy, GenezioAuth, GnzContext } from "@genezio/types";

let d = [
  {
    id: 1,
    title: "Books"
  },
  { 
    id: 2,
    title: "Movies"
  }];

@GenezioDeploy()
export class categories {
  constructor() {}

  async getList(): Promise<any> {
    return {data: d, total: d.length};
  }

  async getOne({id}: {id: number}): Promise<any> {
    return {data: d.find((item) => item.id == id), total: 1};
  }

  @GenezioAuth()
  async create(context: GnzContext, {title}: {title: string}): Promise<any> {
    console.log("User: ", context.user?.email, " created a category");
    d.push({id: d.length + 1, title});
    return d.find((item) => item.id == d.length);
  }

  @GenezioAuth()
  async update(context: GnzContext, {id, title}: {id: number, title: string}): Promise<any> {
    console.log("User: ", context.user?.email, " updated a category");
    const index = d.findIndex((item) => item.id == id);
    if (index === -1) throw new Error("Not found");
    d[index].title = title;
    return d[index];
  }

  @GenezioAuth()
  async deleteOne(context: GnzContext, {id}: {id: number}): Promise<any> {
    console.log("User: ", context.user?.email, " deleted a category");
    const index = d.findIndex((item) => item.id == id);
    if (index === -1) throw new Error("Not found");
    d.splice(index, 1);
    return true;
  }
}