import { LMOGTagsViewData } from "./LMOGTagsViewData";

enum PollMultiSelectState {
  EXACTLY = "exactly",
  AT_MAX = "at_max",
  AT_LEAST = "at_least",
}

enum PollType {
  INSTANT = "instant",
  DEFERRED = "deferred",
}

// data model for attachmentMeta object inside attachments
export interface LMAttachmentMetaViewData {
  entityId?: string;
  name?: string;
  format?: string;
  size?: number;
  duration?: number;
  pageCount?: number;
  url: string;
  thumbnailUrl?: string;
  ogTags: LMOGTagsViewData;
  coverImageUrl?: string;
  title?: string;
  body?: string;
  pollQuestion?: string;
  expiryTime?: number;
  options?: string[];
  multipleSelectState?: PollMultiSelectState;
  pollType?: PollType;
  multipleSelectNumber?: number;
  isAnonymous?: boolean;
  allowAddOption?: boolean;
}
