import { GenezioDeploy, GenezioAuth, GnzContext } from "@genezio/types";

import data from "./data.json";
let bd: any[] = data.blog_posts;
let cd = data.categories;

@GenezioDeploy()
export class blog_posts {
  constructor() {}

    async getList({pagination, sorters, filters} : {pagination: any, sorters: any, filters: any}): Promise<any> {
      let r = {data: [] as Record<string, any>, total: 0};
      bd.forEach((item:any) => {
          const cat = cd.find((c) => c.id == item.category.id);
          if (cat) {
              item.category = cat;
          }
          r.data.push(item);
      });
      r.total = r.data.length;

      const {current, pageSize} = pagination;
      const startIndex = (current - 1) * pageSize;
      const endIndex = startIndex + pageSize;
    
      r.data = r.data.slice(startIndex, endIndex);
      return r;
    }
  
    async getOne({id}: {id: number}): Promise<any> {
        let r = {data: bd.find((item) => item.id == id), total: 1};
        if (r.data) {
          const cat = cd.find((item) => item.id == r.data?.category.id);
          if (cat)
            r.data.category = cat;
        }
        return r;
    }
  
    @GenezioAuth()
    async create(context: GnzContext, {title, content, category, status, createdAt}: {title: string, content: string, category: any, status: string, createdAt: string}): Promise<any> {
      bd.push({
        id: bd.length + 1,
        title: title,
        content: content,
        category: category,
        status: status,
        createdAt: createdAt
    });
      return bd.find((item) => item.id == bd.length);
    }
  
    async update(context: GnzContext, {id, title, content, category, status, createdAt}: {id: number, title: string, content: string, category: any, status: string, createdAt: string}): Promise<any> {
        const index = bd.findIndex((item) => item.id == id);
        if (index === -1) throw new Error("Not found");
        bd[index].title = title;
        bd[index].content = content;
        bd[index].category = category;
        bd[index].status = status;
        bd[index].createdAt = createdAt;
        return bd[index];
    }
  
    async deleteOne(context: GnzContext, {id}: {id: number}): Promise<any> {
      const index = bd.findIndex((item) => item.id == id);
      if (index === -1) throw new Error("Not found");
      bd.splice(index, 1);
      return true;
    }
}