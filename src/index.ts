import {
  AddCommentRequest,
  AddPostRequest,
  DecodeURLRequest,
  DeleteCommentRequest,
  DeletePostRequest,
  EditCommentRequest,
  HidePostRequest,
  EditPostRequest,
  GetAllMembersRequest,
  GetCommentLikesRequest,
  GetCommentRequest,
  GetFeedRequest,
  GetPersonalisedFeedRequest,
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
  UpdateUserTopicsRequest,
  GetUserTopicsRequest,
  PostSeenRequest,
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
import { FilterComment } from "@likeminds.community/feed-js";
import LMResponse from "./core/services/lmresponse";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TokenValues } from "./enums/TokenValues";
import { LogoutUserRequest } from "./models/requestModels/LogoutUserRequest";
import { TemporaryPost } from "./post/models/TemporaryPostViewData";
import { SaveTemporaryPostRequest } from "./models/requestModels/SaveTemporaryPostRequest";
import { GetTemporaryPostResponse } from "./models/responseModels/GetTemporaryPostResponse";

class LMFeedClient {
  private rnInitiateUserClient: RNInitiateUserClient;
  private networkLibrary: NetworkLibrary;
  private dbLibrary: DBLibrary;
  public dlClient: DLClient;
  private platformCode: string | null = null;
  private versionCode: number | null = null;
  private apiKey: string | null = null;
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

  public async getIsUserOnboardingDone() {
    try {
      const isUserOnboardingDone = await AsyncStorage.getItem(
        TokenValues.IS_USER_ONBOARDING_DONE
      );
      if (isUserOnboardingDone == null)
        return new LMResponse(
          null,
          "IS_USER_ONBOARDING_DONE key not found",
          false
        );
      return new LMResponse(
        JSON.parse(isUserOnboardingDone),
        "IS_USER_ONBOARDING_DONE key found",
        true
      );
    } catch (error) {
      return new LMResponse(null, "Fetching operation failed.", false);
    }
  }

  public async setIsUserOnboardingDone(isUserOnboardingDone: boolean) {
    try {
      await AsyncStorage.setItem(
        TokenValues.IS_USER_ONBOARDING_DONE,
        JSON.stringify(isUserOnboardingDone)
      );
      return new LMResponse(isUserOnboardingDone, null, true);
    } catch (error) {
      return new LMResponse(null, "Update operation failed.", false);
    }
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
      const getTopicsResponse = await this.dlClient.getTopics(request);
      return getTopicsResponse;
    } catch (error) {
      console.log("Error while getting topics:", error);
      throw error;
    }
  }

  async updateUserTopics(request: UpdateUserTopicsRequest) {
    try {
      const updateUserTopicsResponse =
        await this.dlClient.updateUserTopics(request);
      return updateUserTopicsResponse;
    } catch (error) {
      console.log("Error while updating user topics:", error);
      throw error;
    }
  }

  async getUserTopics(request: GetUserTopicsRequest) {
    try {
      const getUserTopicsResponse = await this.dlClient.getUserTopics(request);
      return getUserTopicsResponse;
    } catch (error) {
      console.log("Error while getting user topics:", error);
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

  async hidePost(request: HidePostRequest) {
    try {
      const hidePostResponse = await this.dlClient.hidePost(request);
      return hidePostResponse;
    } catch (error) {
      console.log("Error while hiding post:", error);
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
      console.log("Error while getting feed:", error);
      throw error;
    }
  }

  async getPersonalisedFeed(request: GetPersonalisedFeedRequest) {
    try {
      const getPersonalisedFeedResponse =
        await this.dlClient.getPersonalisedFeed(request);
      return getPersonalisedFeedResponse;
    } catch (error) {
      console.log("Error while getting personalised feed:", error);
      throw error;
    }
  }

  async getReportTags(request: GetReportTagsRequest) {
    try {
      const getReportTagsResponse = await this.dlClient.getReportTags(request);
      return getReportTagsResponse;
    } catch (error) {
      console.log("Error while getting report tags:", error);
      throw error;
    }
  }

  async postReport(request: PostReportRequest) {
    try {
      const postReportResponse = await this.dlClient.postReport(request);
      return postReportResponse;
    } catch (error) {
      console.log("Error while post report:", error);
      throw error;
    }
  }

  async getComments(comment: GetCommentRequest) {
    try {
      const getCommentResponse = await this.dlClient.getComments(
        GetCommentRequest.builder()
          .setCommentId(comment.commentId)
          .setPage(comment.page)
          .setPageSize(comment.pageSize)
          .setPostId(comment.postId)
          .build()
      );
      return getCommentResponse;
    } catch (error) {
      console.log("Error while getting comments:", error);
      throw error;
    }
  }

  async addComment(request: AddCommentRequest) {
    try {
      const postReportResponse = await this.dlClient.addComment(request);
      return postReportResponse;
    } catch (error) {
      console.log("Error while adding comments:", error);
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

  async registerDevice(request: RegisterDeviceRequest) {
    try {
      return await this.rnInitiateUserClient.registerDevice(request);
    } catch (error) {
      console.log("Error while validate register device", error);
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

  async logoutUser(logoutRequest?: LogoutUserRequest) {
    try {
      return await this.rnInitiateUserClient.logoutUser(logoutRequest);
    } catch (error) {
      console.log("Error while logging out user", error);
      throw error;
    }
  }

  async postSeen(request: PostSeenRequest) {
    try {
      return await this.dlClient.postSeen(request);
    } catch (error) {
      console.log("Error while seen post", error);
      throw error;
    }
  }

  public async setSeenPost(seenPost: string[]) {
    try {
      return await AsyncStorage.setItem(
        TokenValues.SEEN_POST,
        JSON.stringify(seenPost)
      );
    } catch (error) {
      return error;
    }
  }

  public async getSeenPost() {
    try {
      return await AsyncStorage.getItem(TokenValues.SEEN_POST);
    } catch (error) {
      return error;
    }
  }

  public async clearSeenPost() {
    try {
      return await AsyncStorage.removeItem(TokenValues.SEEN_POST);
    } catch (error) {
      return error;
    }
  }

  async saveTemporaryPost(request: SaveTemporaryPostRequest) {
    try {
      await AsyncStorage.setItem(TokenValues.TEMPORARY_POST, JSON.stringify(request.tempPost));
      return new LMResponse(null, null, true);
    } catch (e) {
      console.error('Failed to save data:', e);
      return new LMResponse(e, null, false);
    }
  }

  async getTemporaryPost(): Promise<LMResponse<GetTemporaryPostResponse>> {
    try {
      const jsonValue = await AsyncStorage.getItem(TokenValues.TEMPORARY_POST);
      if (jsonValue != null) {
        const parsedData = JSON.parse(jsonValue);
        return new LMResponse({ tempPost: parsedData }, null, true);
      } else {
        return new LMResponse(null, null, true);
      }
    } catch (e) {
      console.error('Failed to fetch data:', e);
      return new LMResponse(e, null, false);
    }
  }

  async deleteTemporaryPost() {
    try {
      await AsyncStorage.removeItem(TokenValues.TEMPORARY_POST);
      return new LMResponse(null, null, true)
    } catch (e) {
      console.error('Failed to delete data:', e);
      return new LMResponse(e, null, false)
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
  HidePostRequest,
  EditPostRequest,
  GetPostLikesRequest,
  GetPostRequest,
  LikePostRequest,
  PinPostRequest,
  SavePostRequest,
  GetTaggingListRequest,
  GetFeedRequest,
  GetPersonalisedFeedRequest,
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
  UpdateUserTopicsRequest,
  GetUserTopicsRequest,
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
  FilterComment,
  TokenValues,
  PostSeenRequest,
};
