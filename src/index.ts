import NetworkLibrary from "@likeminds.community/feed-js/dist/core/services/networklibrary";
import InitiateUserClient from "@likeminds.community/feed-js/dist/initiateUser/InitiateUserClient";
import PostClient from "@likeminds.community/feed-js/dist/post/PostClient";
import ModerationClient from "@likeminds.community/feed-js/dist/moderation/ModerationClient";
import CommentClient from "@likeminds.community/feed-js/dist/comment/CommentClient";
import NotificationFeedClient from "@likeminds.community/feed-js/dist/notificationFeed/NotificationFeedClient";
import UniversalFeedClient from "@likeminds.community/feed-js/dist/universalfeed/UniversalFeedClient";
import HelperClient from "@likeminds.community/feed-js/dist/helper/HelperClient";
import PollFeedClient from "@likeminds.community/feed-js/dist/poll/PollClient";
import {
  AddCommentRequest,
  AddPostRequest,
  DecodeURLRequest,
  DeleteCommentRequest,
  DeletePostRequest,
  EditCommentRequest,
  EditPostRequest,
  GetAllMembersRequest,
  GetCommentLikesRequest,
  GetCommentRequest,
  GetFeedRequest,
  GetNotificationFeedRequest,
  GetPostLikesRequest,
  GetPostRequest,
  GetReportTagsRequest,
  GetTaggingListRequest,
  GetTopicsRequest,
  InitiateUserRequest,
  LMSDKCallbacks,
  LikeCommentRequest,
  LikePostRequest,
  MarkReadNotificationRequest,
  PinPostRequest,
  PostReportRequest,
  RegisterDeviceRequest,
  ReplyCommentRequest,
  SavePostRequest,
  ValidateUserRequest,
} from "@likeminds.community/feed-js";
import { SubmitPollVoteRequest } from "@likeminds.community/feed-js/dist/poll/model/SubmitPollVoteRequest";
import { AddPollOptionRequest } from "@likeminds.community/feed-js/dist/poll/model/AddPollOptionRequest";
import { GetPollVotesRequest } from "@likeminds.community/feed-js/dist/poll/model/GetPollVotesRequest";
import Attachment from "@likeminds.community/feed-js/dist/post/model/Attachment";
import AttachmentMeta from "@likeminds.community/feed-js/dist/post/model/AttachmentMeta";
import { GetFeedResponse } from "@likeminds.community/feed-js/dist/universalfeed/model/GetFeedResponse";
import { IPost } from "@likeminds.community/feed-js/dist/shared/models/post";
import { IOgTag } from "@likeminds.community/feed-js/dist/shared/models/ogTags";
import { IUser } from "@likeminds.community/feed-js/dist/shared/models/user";
import { IMenuItem } from "@likeminds.community/feed-js/dist/shared/models/menuItem";
import { AddCommentResponse } from "@likeminds.community/feed-js/dist/comment/model/AddCommentResponse";
import { GetCommentResponse } from "@likeminds.community/feed-js/dist/comment/model/GetCommentResponse";
import { IComment } from "@likeminds.community/feed-js/dist/shared/models/comment";
import { EditCommentResponse } from "@likeminds.community/feed-js/dist/comment/model/EditCommentResponse";
import {
  IMemberRight,
  IMemberState,
} from "@likeminds.community/feed-js/dist/shared/models/memberRights";
import {
  IActivities,
  IActivity,
} from "@likeminds.community/feed-js/dist/shared/models/activity";
import { IMember } from "@likeminds.community/feed-js/dist/initiateUser/model/GetAllMembersResponse";
import { LMFeedTopics } from "@likeminds.community/feed-js/dist//post/model/GetTopicsResponse";
import { GetPostLikesResponse } from "@likeminds.community/feed-js/dist/post/model/GetPostLikesResponse";
import Like from "@likeminds.community/feed-js/dist/post/model/Like";
import DBLibrary from "./core/services/networkLibrary";
import RNInitiateUserClient from "./initiateUser/RNInitiateUserClient";

class LMFeedClient {
  private initiateUserClient: InitiateUserClient;
  private rnInitiateUserClient: RNInitiateUserClient;
  private postClient: PostClient;
  private moderationClient: ModerationClient;
  private commentClient: CommentClient;
  private networkLibrary: NetworkLibrary;
  private dbLibrary: DBLibrary;
  private notificationFeedClient: NotificationFeedClient;
  private feedClient: UniversalFeedClient;
  private platformCode: string | null = null;
  private versionCode: number | null = null;
  private apiKey: string | null = null;
  private helperClient: HelperClient;
  private LMSDKCallbacks: LMSDKCallbacks;

  private pollFeedClient: PollFeedClient;
  constructor() {
    this.networkLibrary = new NetworkLibrary(this.LMSDKCallbacks);
    this.dbLibrary = new DBLibrary();
    this.initiateUserClient = new InitiateUserClient(this.networkLibrary);
    this.rnInitiateUserClient = new RNInitiateUserClient(this.networkLibrary);
    this.postClient = new PostClient(this.networkLibrary);
    this.moderationClient = new ModerationClient(this.networkLibrary);
    this.feedClient = new UniversalFeedClient(this.networkLibrary);
    this.moderationClient = new ModerationClient(this.networkLibrary);
    this.commentClient = new CommentClient(this.networkLibrary);
    this.notificationFeedClient = new NotificationFeedClient(
      this.networkLibrary
    );
    this.helperClient = new HelperClient(this.networkLibrary);
    this.pollFeedClient = new PollFeedClient(this.networkLibrary);
  }

  public static Builder(): LMFeedClient {
    return new LMFeedClient();
  }

  setPlatformCode(platformCode: string) {
    this.platformCode = platformCode;
    return this;
  }

  setVersionCode(versionCode: number) {
    this.versionCode = versionCode;
    return this;
  }
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    return this;
  }

  public setLMSDKCallbacks(lmSdkCallbacks: LMSDKCallbacks) {
    this.LMSDKCallbacks = lmSdkCallbacks;
    this.networkLibrary.setLMSDKCallbacks(lmSdkCallbacks);
  }

  public build(): LMFeedClient {
    if (!this.platformCode) {
      throw new Error(
        "Please provide platformCode before building the LMFeedClient."
      );
    }
    if (!this.versionCode) {
      throw new Error(
        "Please provide versionCode before building the LMFeedClient."
      );
    }

    this.networkLibrary.setPlatformCode(this.platformCode);
    this.networkLibrary.setVersionCode(this.versionCode);
    this.networkLibrary.setApiKey(this.apiKey);

    return this;
  }

  public setAccessTokenInLocalStorage(token: string) {
    this.dbLibrary.setAccessTokenInLocalStorage(token);
  }

  public setRefreshTokenInLocalStorage(token: string) {
    this.dbLibrary.setRefreshTokenInLocalStorage(token);
  }
  public setApiKeyInLocalStorage(apiKey: string) {
    this.dbLibrary.setApiKeyInLocalStorage(apiKey);
  }
  public setUserInLocalStorage(user: string) {
    this.dbLibrary.setUserInLocalStorage(user);
  }
  public getUserFromLocalStorage() {
    return this.dbLibrary.getUserFromRNLocalStorage();
  }
  public getApiKeyFromLocalStorage() {
    return this.dbLibrary.getApiKeyFromRNLocalStorage();
  }

  public getAccessTokenFromLocalStorage() {
    return this.dbLibrary.getAccessTokenFromRNLocalStorage();
  }

  public getRefreshTokenFromLocalStorage() {
    return this.dbLibrary.getRefreshTokenFromRNLocalStorage();
  }

  public getAccessToken() {
    return this.networkLibrary.getAccessToken();
  }

  public getRefreshToken() {
    return this.networkLibrary.getRefreshToken();
  }

  async validateUser(validateUserRequest: ValidateUserRequest) {
    try {
      const initiateUserResponse =
        await this.rnInitiateUserClient.validateUser(validateUserRequest);

      return initiateUserResponse;
    } catch (error) {
      console.error("Error while validating the user:", error);
      throw error;
    }
  }

  async initiateUser(initiateUserRequest: InitiateUserRequest) {
    try {
      const initiateUserResponse =
        await this.rnInitiateUserClient.initiateUser(initiateUserRequest);

      return initiateUserResponse;
    } catch (error) {
      console.error("Error while initiating the user:", error);
      throw error;
    }
  }

  async addPost(addPostRequest: AddPostRequest) {
    try {
      const addPostResponse = await this.postClient.addPost(addPostRequest);
      return addPostResponse;
    } catch (error) {
      console.log("Error while posting feed :", error);
      return error;
    }
  }

  async decodeURL(decodeURLRequest: DecodeURLRequest) {
    try {
      const addPostResponse = await this.postClient.decodeUrl(decodeURLRequest);
      return addPostResponse;
    } catch (error) {
      console.log("Error while posting feed :", error);
      return error;
    }
  }

  async deletePost(deletePostRequest: DeletePostRequest) {
    try {
      const deletePostResponse =
        await this.postClient.deletePost(deletePostRequest);
      return deletePostResponse;
    } catch (error) {
      console.log("Error while deleting post:", error);
      throw error;
    }
  }

  async editPost(editPostRequest: EditPostRequest) {
    try {
      const editPostResponse = await this.postClient.editPost(editPostRequest);
      return editPostResponse;
    } catch (error) {
      console.log("Error while editing post:", error);
      throw error;
    }
  }

  // Function for GetPostLikesRequest
  async getPostLikes(getPostLikesRequest: GetPostLikesRequest) {
    try {
      const getPostLikesResponse =
        await this.postClient.getPostLikes(getPostLikesRequest);
      return getPostLikesResponse;
    } catch (error) {
      console.log("Error while getting post likes:", error);
      throw error;
    }
  }

  async getPost(getPostRequest: GetPostRequest) {
    try {
      const getPostResponse = await this.postClient.getPost(getPostRequest);
      return getPostResponse;
    } catch (error) {
      console.log("Error while getting post:", error);
      throw error;
    }
  }

  async getTopics(request: GetTopicsRequest) {
    try {
      const getPostResponse = await this.postClient.getTopics(request);
      return getPostResponse;
    } catch (error) {
      console.log("Error while getting post:", error);
      throw error;
    }
  }

  async likePost(likePostRequest: LikePostRequest) {
    try {
      const likePostResponse = await this.postClient.likePost(likePostRequest);
      return likePostResponse;
    } catch (error) {
      console.log("Error while liking post:", error);
      throw error;
    }
  }

  async pinPost(request: PinPostRequest) {
    try {
      const pinPostResponse = await this.postClient.pinPost(request);
      return pinPostResponse;
    } catch (error) {
      console.log("Error while pinning post:", error);
      throw error;
    }
  }

  async savePost(request: SavePostRequest) {
    try {
      const savePostResponse = await this.postClient.savePost(request);
      return savePostResponse;
    } catch (error) {
      console.log("Error while saving post:", error);
      throw error;
    }
  }
  async getTaggingList(request: GetTaggingListRequest) {
    try {
      const gettaggingListResponse =
        await this.postClient.getTaggingList(request);
      return gettaggingListResponse;
    } catch (error) {
      console.log("Error while getting tagging list:", error);
      throw error;
    }
  }
  async getFeed(request: GetFeedRequest) {
    try {
      const getFeedResponse = await this.feedClient.getFeed(request);
      return getFeedResponse;
    } catch (error) {
      console.log("Error while getting tagging list:", error);
      throw error;
    }
  }
  async getReportTags(request: GetReportTagsRequest) {
    try {
      const getReportTagsResponse =
        await this.moderationClient.getReportTags(request);
      return getReportTagsResponse;
    } catch (error) {
      console.log("Error while getting tagging list:", error);
      throw error;
    }
  }
  async postReport(request: PostReportRequest) {
    try {
      const postReportResponse =
        await this.moderationClient.postReport(request);
      return postReportResponse;
    } catch (error) {
      console.log("Error while getting tagging list:", error);
      throw error;
    }
  }
  async getComments(
    postId: string,
    comment: GetCommentRequest,
    commentId: string,
    pageNo: number
  ) {
    try {
      const getCommentResponse = await this.commentClient.getComment(
        GetCommentRequest.builder()
          .setcommentId(commentId)
          .setpage(pageNo)
          .setpageSize(10)
          .setpostId(postId)
          .build(),
        postId,
        commentId
      );
      return getCommentResponse;
    } catch (error) {
      console.log("Error while getting tagging list:", error);
      throw error;
    }
  }

  async addComment(request: AddCommentRequest) {
    try {
      const postReportResponse = await this.commentClient.addComment(request);
      return postReportResponse;
    } catch (error) {
      console.log("Error while getting tagging list:", error);
      throw error;
    }
  }

  async replyComment(request: ReplyCommentRequest) {
    try {
      return await this.commentClient.replyComment(request);
    } catch (error) {
      console.log("Error while replying to comment:", error);
      throw error;
    }
  }
  async editComment(request: EditCommentRequest) {
    try {
      return await this.commentClient.editComment(request);
    } catch (error) {
      console.log("Error while editing comment:", error);
      throw error;
    }
  }

  async deleteComment(request: DeleteCommentRequest) {
    try {
      return await this.commentClient.deleteComment(request);
    } catch (error) {
      console.log("Error while deleting comment:", error);
      throw error;
    }
  }
  async likeComment(request: LikeCommentRequest) {
    try {
      return await this.commentClient.likeComment(request);
    } catch (error) {
      console.log("Error while liking comment:", error);
      throw error;
    }
  }
  async getCommentLikes(request: GetCommentLikesRequest) {
    try {
      return await this.commentClient.getCommentLikes(request);
    } catch (error) {
      console.log("Error while getting comment likes:", error);
      throw error;
    }
  }
  async getMemberState() {
    try {
      return await this.initiateUserClient.getMemberState();
    } catch (error) {
      console.log("Error while getting member state:", error);
      throw error;
    }
  }

  async getNotificationFeed(request: GetNotificationFeedRequest) {
    try {
      return await this.notificationFeedClient.getNotificationFeed(request);
    } catch (error) {
      console.log("Error while getting notification feed:", error);
      throw error;
    }
  }

  async markReadNotification(request: MarkReadNotificationRequest) {
    try {
      return await this.notificationFeedClient.markReadNotification(request);
    } catch (error) {
      console.log("Error while marking notification as read:", error);
      throw error;
    }
  }

  async getUnreadNotificationCount() {
    try {
      return await this.notificationFeedClient.getUnreadNotificationCount();
    } catch (error) {
      console.log("Error while getting unread notification count:", error);
      throw error;
    }
  }
  async getAllMembers(request: GetAllMembersRequest) {
    try {
      return await this.initiateUserClient.getAllMembers(request);
    } catch (error) {
      console.log("Error while members", error);
      throw error;
    }
  }
  async validateRegisterDeviceRequest(request: RegisterDeviceRequest) {
    try {
      return await this.helperClient.validateRegisterDeviceRequest(request);
    } catch (error) {
      console.log("Error while validate register device", error);
      throw error;
    }
  }
  async registerDevice() {
    try {
      return await this.helperClient.registerDevice();
    } catch (error) {
      console.log("Error while register device", error);
      throw error;
    }
  }
  async submitPollVote(request: SubmitPollVoteRequest) {
    try {
      return await this.pollFeedClient.submitPollVote(request);
    } catch (error) {
      console.log("Error while submit poll", error);
      throw error;
    }
  }
  async addPollOption(request: AddPollOptionRequest) {
    try {
      return await this.pollFeedClient.addPollOption(request);
    } catch (error) {
      console.log("Error while add poll option", error);
      throw error;
    }
  }
  async getPollVotes(request: GetPollVotesRequest) {
    try {
      return await this.pollFeedClient.getPollVotes(request);
    } catch (error) {
      console.log("Error while get poll votes", error);
      throw error;
    }
  }
}

export {
  LMFeedClient,
  InitiateUserRequest,
  AddPostRequest,
  Attachment,
  AttachmentMeta,
  DecodeURLRequest,
  DeletePostRequest,
  EditPostRequest,
  GetPostLikesRequest,
  GetPostRequest,
  LikePostRequest,
  PinPostRequest,
  SavePostRequest,
  GetTaggingListRequest,
  GetFeedRequest,
  GetFeedResponse,
  IPost,
  IOgTag,
  IUser,
  IMenuItem,
  IComment,
  GetReportTagsRequest,
  PostReportRequest,
  AddCommentRequest,
  AddCommentResponse,
  GetCommentRequest,
  GetCommentResponse,
  ReplyCommentRequest,
  DeleteCommentRequest,
  EditCommentResponse,
  LikeCommentRequest,
  GetCommentLikesRequest,
  IMemberState,
  IMemberRight,
  GetNotificationFeedRequest,
  MarkReadNotificationRequest,
  IActivities,
  IActivity,
  GetAllMembersRequest,
  IMember,
  EditCommentRequest,
  GetTopicsRequest,
  LMFeedTopics,
  ValidateUserRequest,
  RegisterDeviceRequest,
  LMSDKCallbacks,
  GetPostLikesResponse,
  Like,
};
