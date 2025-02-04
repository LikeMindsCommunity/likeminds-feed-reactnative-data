import { Attachment, FilterComment, Reply } from "@likeminds.community/feed-js";

// data model for post ViewData
export interface TemporaryPost {
  id?: string;
  temporaryId: string;
  attachments?: Array<Attachment>;
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
  menuItems?: Array<MenuItem>;
  replies?: Reply[];
  text?: string;
  heading?: string;
  updatedAt?: number;
  userId?: string;
  uuid?: string;
  topics?: string[];
  filteredComments?: FilterComment;
}

export interface MenuItem {
    id: number;
    title: string;
}