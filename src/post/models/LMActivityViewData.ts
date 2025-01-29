import {LMActivityEntityViewData} from './LMActivityEntityViewData';
import {LMUserViewData} from './LMUserViewData';

export interface LMActivityViewData {
  id: string;
  isRead: boolean;
  actionOn: string;
  actionBy: Array<string>;
  entityType: number;
  entityId: string;
  entityOwnerId: string;
  action: number;
  cta: string;
  activityText: string;
  activityEntityData?: LMActivityEntityViewData;
  activityByUser: LMUserViewData;
  createdAt: number;
  updatedAt: number;
  uuid: string;
}
