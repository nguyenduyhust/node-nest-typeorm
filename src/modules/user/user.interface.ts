import { SortingOptions } from '~/common/interfaces/sorting.interface';
import { UserSortByEnum } from './user.enum';

export type UserSortingOptions = SortingOptions<UserSortByEnum>;

export interface UserFilteringOptions {
  email?: string;
  fullName?: string;
}
