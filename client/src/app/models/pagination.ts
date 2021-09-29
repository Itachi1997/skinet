import { IProduct } from './products';

export interface IPagination {
  pageindex: number;
  pagesize: number;
  count: number;
  data: IProduct[];
}
