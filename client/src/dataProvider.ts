import { CreateResponse, DataProvider } from "@refinedev/core";
import * as gsdk from "@genezio-sdk/refine";

const request = async(fName: string, resource: string, params: any = []) => {
    const gclass = gsdk[resource as keyof typeof gsdk];
    const ret = await (gclass[fName as keyof typeof gclass] as any)(params[0]);
    return ret;
};

const dataProvider: DataProvider = {
    // required methods
    getList: async({ resource, pagination, sorters, filters, meta }) => {
        return request("getList", resource);
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