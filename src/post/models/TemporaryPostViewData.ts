import { FilterComment } from "@likeminds.community/feed-js";
import { LMAttachmentViewData } from "./LMAttachmentViewData";
import { LMCommentViewData } from "./LMCommentViewData";
import { LMMenuItemsViewData } from "./LMMenuItemsViewData";
import { LMUserViewData } from "./LMUserViewData";

// data model for post ViewData
export interface LMTemporaryPostViewData {
  id?: string;
  temporaryId: string;
  attachments?: Array<LMAttachmentViewData>;
  commentsCount?: number;
  communityId?: number;
  createdAt?: number;
  isEdited?: boolean;
  isLiked?: boolean;
  isPinned?: boolean;
  isSaved?: boolean;
  likesCount?: number;
  isAnonymous?: boolean;
  isHidden?: boolean;
  menuItems?: Array<LMMenuItemsViewData>;
  replies?: Array<LMCommentViewData>;
  text?: string;
  heading?: string;
  updatedAt?: number;
  userId?: string;
  uuid?: string;
  user?: LMUserViewData;
  topics?: string[];
  users?: { [key: string]: LMUserViewData };
  filteredComments?: FilterComment;
}