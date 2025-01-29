import {LMAttachmentViewData} from './LMAttachmentViewData';
import {LMCommentViewData} from './LMCommentViewData';
import {LMUserViewData} from './LMUserViewData';

export interface LMActivityEntityViewData {
  id: string;
  text: string;
  deleteReason?: string;
  deletedBy?: string;
  heading?: string;
  attachments?: Array<LMAttachmentViewData>;
  communityId: number;
  isEdited: boolean;
  isPinned?: boolean;
  userId: string;
  user: LMUserViewData;
  replies?: Array<LMCommentViewData>;
  level?: number;
  createdAt: number;
  updatedAt: number;
  uuid: string;
  deletedByUUID?: string;
  postId?: string
}
