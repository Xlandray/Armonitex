import type {
  BaseRecord,
  CreateParams,
  CreateResponse,
  CrudSorting,
  DataProvider,
  DeleteOneParams,
  DeleteOneResponse,
  GetListParams,
  GetListResponse,
  GetManyParams,
  GetManyResponse,
  GetOneParams,
  GetOneResponse,
  LogicalFilter,
  UpdateParams,
  UpdateResponse,
} from "@refinedev/core";

import { apiBaseUrl, axiosInstance } from "./axios";

type PageResponse<T> = { data: T[]; total: number };

// API her filtre icin tek bir skaler query param bekler (?status=teklif).
// antd kolon filtreleri ise her zaman dizi uretir ve Refine bunu "in"
// operatorune cevirir, o yuzden tek elemanli diziyi aciyoruz.
// Karsilanamayan durumlar sessizce yutulmaz; konsola yazilir.
function toQueryValue(filter: LogicalFilter): unknown {
  const { field, operator, value } = filter;
  if (value === undefined || value === null || value === "") return undefined;

  if (operator === "eq") return value;

  if (operator === "in") {
    if (!Array.isArray(value)) return value;
    if (value.length === 0) return undefined;
    if (value.length > 1) {
      console.warn(
        `[dataProvider] '${field}' icin coklu secim API tarafindan desteklenmiyor; ilk deger kullanildi.`,
      );
    }
    return value[0];
  }

  console.warn(`[dataProvider] '${operator}' operatoru desteklenmiyor ('${field}'); filtre atlandi.`);
  return undefined;
}

// API tek alanla siralar: ?sort=title / ?sort=-created_at
function toSortValue(sorters: CrudSorting | undefined): string | undefined {
  const [sorter, ...rest] = sorters ?? [];
  if (!sorter) return undefined;
  if (rest.length > 0) {
    console.warn("[dataProvider] API tek alanla siralama destekliyor; ilk siralama kullanildi.");
  }
  return `${sorter.order === "desc" ? "-" : ""}${sorter.field}`;
}

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>(
    { resource, pagination, filters, sorters }: GetListParams,
  ): Promise<GetListResponse<TData>> => {
    const params: Record<string, unknown> = {
      page: pagination?.currentPage ?? 1,
      page_size: pagination?.pageSize ?? 25,
    };

    for (const filter of filters ?? []) {
      if (!("field" in filter)) {
        console.warn("[dataProvider] Gruplanmis (or/and) filtre desteklenmiyor; atlandi.", filter);
        continue;
      }
      const value = toQueryValue(filter);
      if (value !== undefined) params[filter.field] = value;
    }

    const sort = toSortValue(sorters);
    if (sort) params.sort = sort;

    const response = await axiosInstance.get<PageResponse<TData>>(`/${resource}`, { params });
    return { data: response.data.data, total: response.data.total };
  },
  getOne: async <TData extends BaseRecord = BaseRecord>(
    { resource, id }: GetOneParams,
  ): Promise<GetOneResponse<TData>> => {
    const response = await axiosInstance.get<TData>(`/${resource}/${id}`);
    return { data: response.data };
  },
  getMany: async <TData extends BaseRecord = BaseRecord>(
    { resource, ids }: GetManyParams,
  ): Promise<GetManyResponse<TData>> => {
    const records = await Promise.all(
      ids.map(async (id) => {
        const response = await axiosInstance.get<TData>(`/${resource}/${id}`);
        return response.data;
      }),
    );
    return { data: records };
  },
  create: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>(
    { resource, variables }: CreateParams<TVariables>,
  ): Promise<CreateResponse<TData>> => {
    const response = await axiosInstance.post<TData>(`/${resource}`, variables);
    return { data: response.data };
  },
  update: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>(
    { resource, id, variables }: UpdateParams<TVariables>,
  ): Promise<UpdateResponse<TData>> => {
    const response = await axiosInstance.patch<TData>(`/${resource}/${id}`, variables);
    return { data: response.data };
  },
  deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>(
    { resource, id }: DeleteOneParams<TVariables>,
  ): Promise<DeleteOneResponse<TData>> => {
    await axiosInstance.delete(`/${resource}/${id}`);
    return { data: { id } as TData };
  },
  getApiUrl: () => apiBaseUrl,
};
