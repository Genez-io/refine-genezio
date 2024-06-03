import { DataProvider } from "@refinedev/core";
let cache:any={};
let shouldUseCache:boolean = false;

const simpleHashCode = (s: string):number => {
    let hash:number = 0;
    for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i) + i%10007;
        hash = (hash+c)%1000000007;
    }
    return hash;
}

const request = async(gsdk: any, fName: string, resource: string, params: any) => {
    let paramsHash:number = -1;
    if (shouldUseCache) {
        paramsHash = simpleHashCode(JSON.stringify(params));
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
    }

    const gclass = gsdk[resource as keyof typeof gsdk] ?? undefined;
    if (gclass) {
        const gfunction = gclass[fName as keyof typeof gclass] ?? undefined;

        if (gfunction) {
            const ret = await gfunction(params);
            if (shouldUseCache && fName.startsWith("get")) {
                cache[resource][fName][paramsHash] = ret;
            }
            return ret;    
        } else {
            throw new Error(`Class "${resource}" does not expose a function called "${fName}" in your server implememtaion on Genezio`);
        }
    } else {
        throw new Error(`Class "${resource}" is not exposed in your server implememtaion on Genezio`);
    }
};

export default (gsdk: any, useCache:boolean = false) => {
    shouldUseCache = useCache;
    const dataProvider: DataProvider = {
        // required methods
        getList: async({ resource, pagination, sorters, filters, meta }) => {
            return request(gsdk, "getList", resource, {pagination, sorters, filters});
        },
        create: ({ resource, variables, meta }) => {
            return request(gsdk, "create", resource, variables);
        },
        update: ({ resource, id, variables, meta }) => {
            return request(gsdk, "update", resource, {id: id, ...variables});
        },
        deleteOne: ({ resource, id, variables, meta }) => {
            return request(gsdk, "deleteOne", resource, id);
        },
        getOne: ({ resource, id, meta }) => {
            return request(gsdk, "getOne", resource, id);
        },
        getApiUrl: () => {
            return '';
        },
        deleteMany: ({ resource, ids, variables, meta }) => {
            return request(gsdk, "deleteMany", resource, ids);
        },
        getMany: ({ resource, ids, meta }) => {
            return request(gsdk, "getMany", resource, ids);
        }

        //   optional methods
        //   
        //   createMany: ({ resource, variables, meta }) => Promise,
        //   updateMany: ({ resource, ids, variables, meta }) => Promise,
        //   custom: ({ url, method, filters, sorters, payload, query, headers, meta }) =>
        //     Promise,
    };
    
    return dataProvider;
}