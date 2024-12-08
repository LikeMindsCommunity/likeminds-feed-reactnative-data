import {
  InitiateUserRequest,
  ValidateUserRequest,
  API,
  LMSDKCallbacks,
} from "@likeminds.community/feed-js";
import NetworkLibrary from "@likeminds.community/feed-js/dist/core/services/networklibrary";
import { InitiateUser } from "@likeminds.community/feed-js";
import RNNetworkLibrary from "../core/services/networkLibrary";
import { ModelConverter } from "../utils/ModelConverter";
import { LMFeedClient as DLClient } from "@likeminds.community/feed-js";
import { ValidateUser } from "@likeminds.community/feed-js";
import LMResponse from "src/core/services/lmresponse";
import { Nothing } from "src/models/responseModels/Nothing";
import { LogoutUserRequest } from "src/models/requestModels/LogoutUserRequest";
import RegisterDeviceRequest from "src/models/requestModels/RegisterDeviceRequest";

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
  ): Promise<LMResponse<ValidateUser>> {
    this.networkLibrary.setAccessToken(request.accessToken);
    this.networkLibrary.setRefreshToken(request.refreshToken);

    return this.rnNetworkLibrary
      .makeAuthenticatedRequest(`${API.SDK_INITIATE}`)
      .then((resData: any) => {
        // Handle the response and return the LMResponse object
        const responseData: LMResponse<ValidateUser> =
          ModelConverter.responseBodyParser(resData);

        return responseData;
      })
      .catch((error) => {
        return new LMResponse<ValidateUser>(undefined, error, false);
      });
  }

  public async initiateUser(
    request: InitiateUserRequest
  ): Promise<LMResponse<InitiateUser>> {
    this.rnNetworkLibrary.setApiKeyInLocalStorage(request?.apikey);
    this.rnNetworkLibrary.setUserInLocalStorage(
      JSON.stringify({
        apiKey: request?.apikey,
        userName: request?.userName,
        userUniqueId: request?.uuid,
        imageUrl: request?.imageUrl,
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
        const responseData: LMResponse<InitiateUser> =
          ModelConverter.responseBodyParser(resData);
        return responseData;
      })
      .catch((error) => {
        return new LMResponse<InitiateUser>(undefined, error, false);
      });
  }

  public async registerDevice(
    request: RegisterDeviceRequest
  ): Promise<LMResponse<Nothing>> {
    return this.rnNetworkLibrary
      .makeAuthenticatedRequest(`${API.USER_DEVICE_PUSH}`, {
        method: "POST",
        data: { token: request?.token },
        headers: {
          "x-device-id": request?.deviceId,
        },
      })
      .then((response: any) => {
        // Handle the response and return the LMResponse object
        const responseData: any = ModelConverter.responseBodyParser(
          response.data
        );

        return new LMResponse<Nothing>(responseData, null, true);
      })
      .catch((error) => {
        return new LMResponse<Nothing>(
          null,
          error.message || "An error occurred",
          false
        );
      });
  }

  public async logoutUser(
    logoutUserRequest: LogoutUserRequest
  ): Promise<LMResponse<Nothing>> {
    const tokens = await this.rnNetworkLibrary.getTokens();
    const accessToken = tokens?.accessToken;
    const refreshToken = tokens?.refreshToken;

    // If both tokens are null, clear local storage and DB
    if (!accessToken && !refreshToken) {
      this.rnNetworkLibrary.clearLocalStorage();
      return new LMResponse<Nothing>(null, null, true);
    }

    try {
      // Make an authenticated logout request
      const response = await this.rnNetworkLibrary.makeAuthenticatedRequest(
        `${API.USER_LOGOUT}`,
        {
          method: "POST",
          headers: {
            "x-device-id": logoutUserRequest?.deviceId,
          },
          data: {
            refresh_token: refreshToken,
          },
        }
      );
      if (response.getStatus()) {
        this.rnNetworkLibrary.clearLocalStorage();
        return new LMResponse<Nothing>(null, null, true);
      }
    } catch (error) {
      return new LMResponse<Nothing>(null, error, false);
    }
  }
}
export default RNInitiateUserClient;
