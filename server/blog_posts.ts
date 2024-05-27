import { GenezioDeploy, GenezioAuth, GnzContext } from "@genezio/types";

let d = [{
    id: 1,
    title: "John Doe",
    content: "Hello John!",
    category: {id: 1},
    status: "published",
    createdAt: "2021-10-10T10:00:00Z"
},
{ 
    id: 2,
    title: "Jane Doe",
    content: "Hello Jane!",
    category: {id: 1},
    status: "published",
    createdAt: "2022-10-10T10:00:00Z"
}];

@GenezioDeploy()
export class blog_posts {
    constructor() {}

    async getList(): Promise<any> {
      return {data: d, total: d.length};
    }
  
    async getOne({id}: {id: number}): Promise<any> {
        return {data: d.find((item) => item.id == id), total: 1};
    }
  
    @GenezioAuth()
    async create(context: GnzContext, {title, content, category, status, createdAt}: {title: string, content: string, category: any, status: string, createdAt: string}): Promise<any> {
      d.push({
        id: d.length + 1,
        title: title,
        content: content,
        category: category,
        status: status,
        createdAt: createdAt
    });
      return d.find((item) => item.id == d.length);
    }
  
    async update(context: GnzContext, {id, title, content, category, status, createdAt}: {id: number, title: string, content: string, category: any, status: string, createdAt: string}): Promise<any> {
        const index = d.findIndex((item) => item.id == id);
        if (index === -1) throw new Error("Not found");
        d[index].title = title;
        d[index].content = content;
        d[index].category = category;
        d[index].status = status;
        d[index].createdAt = createdAt;
        return d[index];
    }
  
    async deleteOne(context: GnzContext, {id}: {id: number}): Promise<any> {
      const index = d.findIndex((item) => item.id == id);
      if (index === -1) throw new Error("Not found");
      d.splice(index, 1);
      return true;
    }
}