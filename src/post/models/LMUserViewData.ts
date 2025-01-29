import { LMSDKClientInfoViewData } from "./LMSDKClientInfoViewData";

// data model for user object
export interface LMUserViewData {
  id: number;
  name: string;
  imageUrl: string;
  userUniqueId: string;
  sdkClientInfo: LMSDKClientInfoViewData;
  uuid: string;
  isGuest: boolean;
  updatedAt?: number;
  customTitle: string;
  organisationName: string | undefined;
}
