import {LMLikeViewData} from './LMLikeViewData';
import {LMUserViewData} from './LMUserViewData';

// data model for menu items of post
export interface LMLikeItemViewData {
  likes: LMLikeViewData[];
  totalCount: number;
  users: {
    [key: string]: LMUserViewData;
  };
}
