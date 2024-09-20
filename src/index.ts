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
  Attachment,
  AttachmentMeta,
  NetworkLibrary,
  Like,
  Activity,
  Community,
  User,
  OgTag,
  Post,
  Reply,
  ReportTag,
  TaggingUser,
  Topic,
  MenuItem,
  GetNotification,
  MemberRight,
} from "@likeminds.community/feed-js";
import { SubmitPollVoteRequest } from "@likeminds.community/feed-js/dist/poll/model/SubmitPollVoteRequest";
import { AddPollOptionRequest } from "@likeminds.community/feed-js/dist/poll/model/AddPollOptionRequest";
import { GetPollVotesRequest } from "@likeminds.community/feed-js/dist/poll/model/GetPollVotesRequest";
import { GetUniversalFeed } from "@likeminds.community/feed-js";
import { PostComment } from "@likeminds.community/feed-js";
import { GetCommentDetails } from "@likeminds.community/feed-js";
import { EditComment } from "@likeminds.community/feed-js";
import { GetTopics } from "@likeminds.community/feed-js";
import { GetPostLikes } from "@likeminds.community/feed-js";
import DBLibrary from "./core/services/networkLibrary";
import RNInitiateUserClient from "./initiateUser/RNInitiateUserClient";
import { LMFeedClient as DLClient } from "@likeminds.community/feed-js";
import { GetCommunityConfigurationsResponse } from "./models/responseModels/GetCommunityConfigurationsResponse";
import { EditProfile } from "./models/responseModels/EditProfile";

class LMFeedClient {
  private rnInitiateUserClient: RNInitiateUserClient;
  private networkLibrary: NetworkLibrary;
  private dbLibrary: DBLibrary;
  public dlClient: DLClient;
  private platformCode: string | null = null;
  private versionCode: number | null = null;
  private apiKey: string | null = null;
  // private isBeta: boolean | null = null
  private lmSdkCallbacks: LMSDKCallbacks;

  constructor() {
    this.dlClient = new DLClient();
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
    this.lmSdkCallbacks = lmSdkCallbacks;
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
    this.dlClient.setPlatformCode(this.platformCode);
    this.dlClient.setVersionCode(this.versionCode);
    this.dlClient.setLMSDKCallbacks(this.lmSdkCallbacks);
    this.dlClient.build();
    this.networkLibrary = this.dlClient.getNetworkLibrary();

    this.rnInitiateUserClient = new RNInitiateUserClient(
      this.networkLibrary,
      this.dlClient,
      this.versionCode,
      this.platformCode,
      this.lmSdkCallbacks
    );
    this.dbLibrary = new DBLibrary(
      this.dlClient,
      this.versionCode,
      this.platformCode,
      this.lmSdkCallbacks
    );
    return this;
  }

  public setTokens(accessToken: string, refreshToken: string) {
    this.dbLibrary.setTokens(accessToken, refreshToken);
  }

  public setApiKeyInLocalStorage(apiKey: string) {
    this.dbLibrary.setApiKeyInLocalStorage(apiKey);
  }
  public setUserInLocalStorage(user: string) {
    this.dbLibrary.setUserInLocalStorage(user);
  }
  public async getUserFromLocalStorage() {
    return this.dbLibrary.getUserFromRNLocalStorage();
  }
  public async getApiKeyFromLocalStorage() {
    return this.dbLibrary.getApiKeyFromRNLocalStorage();
  }

  public async getTokens() {
    return this.dbLibrary.getTokens();
  }

  public async getAccessToken() {
    return this.networkLibrary.getAccessToken();
  }

  public async getRefreshToken() {
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

  async editProfile(editProfile: EditProfile) {
    return this.dlClient.editProfile(editProfile);
  }

  async getCommunityConfigurations() {
    try {
      return this.dlClient.getCommunityConfigurations();
    } catch (error) {
      console.log("Error while getting configuration", error);
      throw error;
    }
  }

  async addPost(addPostRequest: AddPostRequest) {
    try {
      const addPostResponse = await this.dlClient.addPost(addPostRequest);
      return addPostResponse;
    } catch (error) {
      console.log("Error while posting feed :", error);
      return error;
    }
  }

  async decodeURL(decodeURLRequest: DecodeURLRequest) {
    try {
      const addPostResponse = await this.dlClient.decodeURL(decodeURLRequest);
      return addPostResponse;
    } catch (error) {
      console.log("Error while posting feed :", error);
      return error;
    }
  }

  async deletePost(deletePostRequest: DeletePostRequest) {
    try {
      const deletePostResponse =
        await this.dlClient.deletePost(deletePostRequest);
      return deletePostResponse;
    } catch (error) {
      console.log("Error while deleting post:", error);
      throw error;
    }
  }

  async editPost(editPostRequest: EditPostRequest) {
    try {
      const editPostResponse = await this.dlClient.editPost(editPostRequest);
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
        await this.dlClient.getPostLikes(getPostLikesRequest);
      return getPostLikesResponse;
    } catch (error) {
      console.log("Error while getting post likes:", error);
      throw error;
    }
  }

  async getPost(getPostRequest: GetPostRequest) {
    try {
      const getPostResponse = await this.dlClient.getPost(getPostRequest);
      return getPostResponse;
    } catch (error) {
      console.log("Error while getting post:", error);
      throw error;
    }
  }

  async getTopics(request: GetTopicsRequest) {
    try {
      const getPostResponse = await this.dlClient.getTopics(request);
      return getPostResponse;
    } catch (error) {
      console.log("Error while getting post:", error);
      throw error;
    }
  }

  async likePost(likePostRequest: LikePostRequest) {
    try {
      const likePostResponse = await this.dlClient.likePost(likePostRequest);
      return likePostResponse;
    } catch (error) {
      console.log("Error while liking post:", error);
      throw error;
    }
  }

  async pinPost(request: PinPostRequest) {
    try {
      const pinPostResponse = await this.dlClient.pinPost(request);
      return pinPostResponse;
    } catch (error) {
      console.log("Error while pinning post:", error);
      throw error;
    }
  }

  async savePost(request: SavePostRequest) {
    try {
      const savePostResponse = await this.dlClient.savePost(request);
      return savePostResponse;
    } catch (error) {
      console.log("Error while saving post:", error);
      throw error;
    }
  }
  async getTaggingList(request: GetTaggingListRequest) {
    try {
      const gettaggingListResponse =
        await this.dlClient.getTaggingList(request);
      return gettaggingListResponse;
    } catch (error) {
      console.log("Error while getting tagging list:", error);
      throw error;
    }
  }
  async getFeed(request: GetFeedRequest) {
    try {
      const getFeedResponse = await this.dlClient.getFeed(request);
      return getFeedResponse;
    } catch (error) {
      console.log("Error while getting tagging list:", error);
      throw error;
    }
  }
  async getReportTags(request: GetReportTagsRequest) {
    try {
      const getReportTagsResponse = await this.dlClient.getReportTags(request);
      return getReportTagsResponse;
    } catch (error) {
      console.log("Error while getting tagging list:", error);
      throw error;
    }
  }
  async postReport(request: PostReportRequest) {
    try {
      const postReportResponse = await this.dlClient.postReport(request);
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
      const getCommentResponse = await this.dlClient.getComments(
        postId,
        GetCommentRequest.builder()
          .setcommentId(commentId)
          .setpage(pageNo)
          .setpageSize(10)
          .setpostId(postId)
          .build(),
        commentId,
        pageNo
      );
      return getCommentResponse;
    } catch (error) {
      console.log("Error while getting tagging list:", error);
      throw error;
    }
  }

  async addComment(request: AddCommentRequest) {
    try {
      const postReportResponse = await this.dlClient.addComment(request);
      return postReportResponse;
    } catch (error) {
      console.log("Error while getting tagging list:", error);
      throw error;
    }
  }

  async replyComment(request: ReplyCommentRequest) {
    try {
      return await this.dlClient.replyComment(request);
    } catch (error) {
      console.log("Error while replying to comment:", error);
      throw error;
    }
  }
  async editComment(request: EditCommentRequest) {
    try {
      return await this.dlClient.editComment(request);
    } catch (error) {
      console.log("Error while editing comment:", error);
      throw error;
    }
  }

  async deleteComment(request: DeleteCommentRequest) {
    try {
      return await this.dlClient.deleteComment(request);
    } catch (error) {
      console.log("Error while deleting comment:", error);
      throw error;
    }
  }
  async likeComment(request: LikeCommentRequest) {
    try {
      return await this.dlClient.likeComment(request);
    } catch (error) {
      console.log("Error while liking comment:", error);
      throw error;
    }
  }
  async getCommentLikes(request: GetCommentLikesRequest) {
    try {
      return await this.dlClient.getCommentLikes(request);
    } catch (error) {
      console.log("Error while getting comment likes:", error);
      throw error;
    }
  }
  async getMemberState() {
    try {
      return await this.dlClient.getMemberState();
    } catch (error) {
      console.log("Error while getting member state:", error);
      throw error;
    }
  }

  async getNotificationFeed(request: GetNotificationFeedRequest) {
    try {
      return await this.dlClient.getNotificationFeed(request);
    } catch (error) {
      console.log("Error while getting notification feed:", error);
      throw error;
    }
  }

  async markReadNotification(request: MarkReadNotificationRequest) {
    try {
      return await this.dlClient.markReadNotification(request);
    } catch (error) {
      console.log("Error while marking notification as read:", error);
      throw error;
    }
  }

  async getUnreadNotificationCount() {
    try {
      return await this.dlClient.getUnreadNotificationCount();
    } catch (error) {
      console.log("Error while getting unread notification count:", error);
      throw error;
    }
  }
  async getAllMembers(request: GetAllMembersRequest) {
    try {
      return await this.dlClient.getAllMembers(request);
    } catch (error) {
      console.log("Error while members", error);
      throw error;
    }
  }
  async validateRegisterDeviceRequest(request: RegisterDeviceRequest) {
    try {
      return await this.dlClient.validateRegisterDeviceRequest(request);
    } catch (error) {
      console.log("Error while validate register device", error);
      throw error;
    }
  }
  async registerDevice() {
    try {
      return await this.dlClient.registerDevice();
    } catch (error) {
      console.log("Error while register device", error);
      throw error;
    }
  }
  async submitPollVote(request: SubmitPollVoteRequest) {
    try {
      return await this.dlClient.submitPollVote(request);
    } catch (error) {
      console.log("Error while submit poll", error);
      throw error;
    }
  }
  async addPollOption(request: AddPollOptionRequest) {
    try {
      return await this.dlClient.addPollOption(request);
    } catch (error) {
      console.log("Error while add poll option", error);
      throw error;
    }
  }
  async getPollVotes(request: GetPollVotesRequest) {
    try {
      return await this.dlClient.getPollVotes(request);
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
  GetUniversalFeed,
  GetReportTagsRequest,
  PostReportRequest,
  AddCommentRequest,
  PostComment,
  GetCommentRequest,
  GetCommentDetails,
  ReplyCommentRequest,
  DeleteCommentRequest,
  EditComment,
  LikeCommentRequest,
  GetCommentLikesRequest,
  GetNotificationFeedRequest,
  MarkReadNotificationRequest,
  GetAllMembersRequest,
  EditCommentRequest,
  GetTopicsRequest,
  GetTopics,
  ValidateUserRequest,
  RegisterDeviceRequest,
  LMSDKCallbacks,
  GetPostLikes,
  Like,
  GetCommunityConfigurationsResponse,
  Activity,
  Community,
  User,
  OgTag,
  Post,
  Reply,
  ReportTag,
  TaggingUser,
  GetNotification,
  Topic,
  MenuItem,
  MemberRight,
};
