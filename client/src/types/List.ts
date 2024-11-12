
export type List = {
    Page: number;
    PageSize: number;
    TotalPages: number;
    Total: number;
    List: object[];
}

export const convertDataToList = (data : unknown) => {
    const listData = data as {
        page: number;
        pageSize: number;
        totalPages: number;
        total: number;
        list: object[]
    };
    const list = {} as List;
    list.Page = listData?.page;
    list.PageSize = listData?.pageSize;
    list.TotalPages = listData?.totalPages;
    list.Total = listData?.total;
    list.List = listData?.list ?? [] as object[];
    return list;
}