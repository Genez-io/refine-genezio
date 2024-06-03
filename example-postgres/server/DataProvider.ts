import { GnzContext } from "@genezio/types";

// Generic interface for response
export type DataProviderResponse<T> = {
  data: T | T[] | undefined;
  total: number;
}

// Type for the list parameters
export type DataProviderListParams = {
  pagination: {
    current: number;
    pageSize: number;
  };
  sorters: {
    field: string;
    order: 'asc' | 'desc';
  }[];
  filters: {
    field: string;
    operator: string;
    value: string;
  }[];
};

// Generic interface for the data provider service
export interface IDataProviderService<T> {
  getList(context: GnzContext, params: DataProviderListParams): Promise<DataProviderResponse<T>>;
  getOne(context: GnzContext, id: any): Promise<DataProviderResponse<T>>;
  create(context: GnzContext, params: Record<string, any>): Promise<T | undefined>;
  update(context: GnzContext, params: Record<string, any>): Promise<T>;
  deleteOne(context: GnzContext, id: any): Promise<boolean>;
}
