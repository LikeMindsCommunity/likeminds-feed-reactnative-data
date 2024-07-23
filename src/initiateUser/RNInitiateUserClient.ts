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
    this.rnNetworkLibrary.setApiKeyInLocalStorage(request?.apikey);
    this.rnNetworkLibrary.setUserInLocalStorage(
      JSON.stringify({
        apiKey: request?.apikey,
        userName: request?.userName,
        userUniqueId: request?.uuid,
      })
    );
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
        this.rnNetworkLibrary.setTokens(accessToken, refreshToken);
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
}

export default RNInitiateUserClient;
