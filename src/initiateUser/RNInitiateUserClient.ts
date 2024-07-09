import {
  InitiateUserRequest,
  ValidateUserRequest,
  API,
  LMSDKCallbacks,
} from "@likeminds.community/feed-js";
import NetworkLibrary from "@likeminds.community/feed-js/dist/core/services/networklibrary";
import { InitiateUserResponse } from "@likeminds.community/feed-js/dist/types/api-responses/initiateUserResponse";
import RNNetworkLibrary from "../core/services/networkLibrary";
import { ModelConverter } from "../utils/ModelConverter";
import { LMFeedClient as DLClient } from "@likeminds.community/feed-js";
import LMResponse from "src/core/services/lmresponse";
import { GetCommunityConfigurationsResponse } from "src/models/responseModels/GetCommunityConfigurationsResponse";
import { ValidateUserResponse } from "@likeminds.community/feed-js/dist/types/api-responses/initiateUserResponse";

class RNInitiateUserClient {
  private rnNetworkLibrary: RNNetworkLibrary;
  private networkLibrary: NetworkLibrary;

  constructor(
    networkInstance: NetworkLibrary,
    dlClient: DLClient,
    versionCode: number,
    platformCode: string,
    lmSdkCallbacks: LMSDKCallbacks
  ) {
    this.networkLibrary = networkInstance;
    this.rnNetworkLibrary = new RNNetworkLibrary(
      dlClient,
      versionCode,
      platformCode,
      lmSdkCallbacks
    );
  }

  public async validateUser(
    request: ValidateUserRequest
  ): Promise<ValidateUserResponse> {
    this.networkLibrary.setAccessToken(request.accessToken);
    this.networkLibrary.setRefreshToken(request.refreshToken);

    return this.rnNetworkLibrary
      .makeAuthenticatedRequest(`${API.SDK_INITIATE}`)
      .then((resData: any) => {
        // Handle the response and return the LMResponse object
        const responseData: ValidateUserResponse =
          ModelConverter.responseBodyParser(resData);

        return responseData;
      })
      .catch((error) => {
        return {
          success: false,
          errorMessage: error,
        };
      });
  }

  public async initiateUser(
    request: InitiateUserRequest
  ): Promise<InitiateUserResponse> {
    const params = ModelConverter.requestBodyGenerator(request);

    return this.rnNetworkLibrary
      .makeAuthenticatedRequest(`${API.SDK_INITIATE}`, {
        method: "POST",
        data: params,
      })
      .then((resData: any) => {
        const accessToken = resData?.data?.access_token;
        this.networkLibrary.setAccessToken(accessToken);
        const refreshToken = resData?.data?.refresh_token;
        this.networkLibrary.setRefreshToken(refreshToken);
        // Handle the response and return the LMResponse object
        const responseData: InitiateUserResponse =
          ModelConverter.responseBodyParser(resData);

        return responseData;
      })
      .catch((error) => {
        return {
          success: false,
          errorMessage: error,
        };
      });
  }

  public async getCommunityConfigurations(): Promise<
    LMResponse<GetCommunityConfigurationsResponse>
  > {
    return this.networkLibrary
      .makeAuthenticatedRequest(`${API.COMMUNITY_CONFIGURATIONS}`)
      .then((resData: any) => {
        // Handle the response and return the LMResponse object
        const responseData: GetCommunityConfigurationsResponse =
          ModelConverter.responseBodyParser(resData.data);

        return new LMResponse<GetCommunityConfigurationsResponse>(
          responseData,
          null,
          true
        );
      })
      .catch((error) => {
        return new LMResponse<GetCommunityConfigurationsResponse>(
          null,
          error.message || "An error occurred",
          false
        );
      });
  }
}

export default RNInitiateUserClient;
