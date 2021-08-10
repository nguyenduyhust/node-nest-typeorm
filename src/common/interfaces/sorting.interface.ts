import { OrderByEnum } from '~/common/enums/sorting.enum';

export interface SortingOptions<S = string> {
  sortBy: S;
  orderBy: OrderByEnum;
}
