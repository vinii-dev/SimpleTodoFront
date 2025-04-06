export interface PagedList<T> {
  items: T[];
  pageSize: number;
  currentPage: number;

  totalCount: number;
  totalPages: number;

  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
