import {LMUserViewData} from './LMUserViewData';

// data model for menu items of post
export interface LMLikeViewData {
  id: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  uuid: string;
  user: LMUserViewData;
}
