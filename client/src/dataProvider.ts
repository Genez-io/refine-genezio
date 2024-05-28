import { CreateResponse, DataProvider } from "@refinedev/core";
import * as gsdk from "@genezio-sdk/refine";

let cache:any={};

const simpleHashCode = (s: string):number => {
    let hash:number = 0;
    for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i) + i%10007;
        hash = (hash+c)%1000000007;
    }
    return hash;
}

const request = async(fName: string, resource: string, params: any = []) => {
    const paramsHash:number = simpleHashCode(JSON.stringify(params));

    if (fName.startsWith("get")) {
        if (cache[resource] === undefined) {
            cache[resource] = {};
        }
        if (cache[resource][fName] === undefined) {
            cache[resource][fName] = {};
        }
        if (cache[resource][fName][paramsHash] !== undefined) {
            return cache[resource][fName][paramsHash];
        }
    } else {
        delete cache[resource];
    }

    const gclass = gsdk[resource as keyof typeof gsdk];
    const ret = await (gclass[fName as keyof typeof gclass] as any)(params[0]);
    if (fName.startsWith("get")) {
        cache[resource][fName][paramsHash] = ret;
    }
    return ret;
};

const dataProvider: DataProvider = {
    // required methods
    getList: async({ resource, pagination, sorters, filters, meta }) => {
        return request("getList", resource, [{pagination, sorters, filters}]);
    },
    create: ({ resource, variables, meta }) => {
        return request("create", resource, [variables]);
    },
    update: ({ resource, id, variables, meta }) => {
        //variables.id = id;
        return request("update", resource, [{id: id, ...variables}]);
    },
    deleteOne: ({ resource, id, variables, meta }) => {
        return request("deleteOne", resource, [{id: id}]);
    },
    getOne: ({ resource, id, meta }) => {
        return request("getOne", resource, [{id: id}]);
    },
    getApiUrl: () => {
        return '';
    },
    //   optional methods
    //   getMany: ({ resource, ids, meta }) => Promise,
    //   createMany: ({ resource, variables, meta }) => Promise,
    //   deleteMany: ({ resource, ids, variables, meta }) => Promise,
    //   updateMany: ({ resource, ids, variables, meta }) => Promise,
    //   custom: ({ url, method, filters, sorters, payload, query, headers, meta }) =>
    //     Promise,
};

export default dataProvider;