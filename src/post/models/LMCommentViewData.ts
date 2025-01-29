import {LMMenuItemsViewData} from './LMMenuItemsViewData';
import {LMUserViewData} from './LMUserViewData';

// data model for comment
export interface LMCommentViewData {
  id: string;
  Id?: string;
  postId: string;
  isEdited: boolean;
  isLiked: boolean;
  text: string;
  userId: string;
  level: number;
  likesCount: number;
  repliesCount: number;
  user: LMUserViewData;
  updatedAt: number;
  createdAt: number;
  menuItems: Array<LMMenuItemsViewData>;
  replies?: Array<LMCommentViewData>;
  parentComment?: LMCommentViewData;
  parentId?: string;
  alreadySeenFullContent?: boolean;
  uuid: string;
  tempId?: string;
}
