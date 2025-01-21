// NetworkLibrary
import { LMSDKCallbacks, NetworkLibrary } from "@likeminds.community/feed-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LMResponse from "./lmresponse";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { environment } from "../../environment";
import { LMFeedClient as DLClient } from "@likeminds.community/feed-js";
import { TokenValues } from "../../enums/TokenValues";

class RNNetworkLibrary {
  private xApiKey: string | null;
  private lmSdkCallbacks: LMSDKCallbacks | null;
  private networkLibrary: NetworkLibrary;
  private versionCode: number;
  private platformCode: string;

  constructor(
    dlClient: DLClient,
    versionCode: number,
    platformCode: string,
    lmSdkCallbacks: LMSDKCallbacks
  ) {
    this.networkLibrary = dlClient.getNetworkLibrary();
    this.versionCode = versionCode;
    this.platformCode = platformCode;
    this.lmSdkCallbacks = lmSdkCallbacks;
  }

  public setUserInLocalStorage(user: string) {
    AsyncStorage.setItem(TokenValues.LOCAL_USER, user);
  }
  public setApiKeyInLocalStorage(apiKey: string) {
    AsyncStorage.setItem(TokenValues.LOCAL_API_KEY, apiKey);
  }

  public setTokens(accessToken: string, refreshToken: string) {
    AsyncStorage.setItem(TokenValues.LOCAL_ACCESS_TOKEN, accessToken);
    AsyncStorage.setItem(TokenValues.LOCAL_REFRESH_TOKEN, refreshToken);
  }

  public async getTokens() {
    const accessToken = await AsyncStorage.getItem(
      TokenValues.LOCAL_ACCESS_TOKEN
    );
    const refreshToken = await AsyncStorage.getItem(
      TokenValues.LOCAL_REFRESH_TOKEN
    );
    return { accessToken, refreshToken };
  }

  public async getApiKeyFromRNLocalStorage() {
    return await AsyncStorage.getItem(TokenValues.LOCAL_API_KEY);
  }
  public async getUserFromRNLocalStorage() {
    return await AsyncStorage.getItem(TokenValues.LOCAL_USER);
  }

  public async clearLocalStorage() {
    try {
      const keys = [
        TokenValues.LOCAL_ACCESS_TOKEN,
        TokenValues.LOCAL_REFRESH_TOKEN,
        TokenValues.LOCAL_API_KEY,
        TokenValues.LOCAL_USER,
        TokenValues.IS_USER_ONBOARDING_DONE,
        TokenValues.SEEN_POST,
      ];
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.log("Error while removing keys in local storage", error);
      throw error;
    }
  }
  private async makeRequest<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const baseUrl: string = environment.apiUrl;
    const requestUrl = baseUrl + url;
    return axios.request<T>({ url: requestUrl, ...config });
  }

  public async makeAuthenticatedRequest<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<LMResponse<T>> {
    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
        "x-sdk-source": "feed",
      },
    };
    const initApi = url.includes("initiate");
    requestConfig.headers["Content-Type"] = "application/json";
    requestConfig.headers["x-version-code"] = this.versionCode?.toString();

    requestConfig.headers["x-platform-code"] = this.platformCode;

    const cFeed = url.includes("community/feed");
    if (cFeed) requestConfig.headers["x-accept-version"] = "v2";

    const isMarkRead = url.includes("mark_read");
    if (isMarkRead)
      requestConfig.headers["Content-Type"] =
        "application/x-www-form-urlencoded";

    // Add the access token to the request headers
    if (this.networkLibrary.getAccessToken()?.length) {
      requestConfig.headers["Authorization"] =
        `Bearer ${this.networkLibrary.getAccessToken()}`;
    }

    // Add the apiKey in initiate api to the request headers
    if (initApi) {
      if (this.platformCode === "rn") {
        const xApiKey = await AsyncStorage.getItem(TokenValues.LOCAL_API_KEY);
        if (xApiKey && xApiKey?.length) {
          requestConfig.headers["x-api-key"] = xApiKey;
        } else {
          throw "Please provide the Api Key";
        }
      } else {
        requestConfig.headers["x-api-key"] = this.xApiKey;
      }
    }
    try {
      const response = await this.makeRequest<{ data: T }>(url, requestConfig);
      return new LMResponse<T>(response?.data?.data, null, true);
    } catch (error) {
      if (error?.response && error?.response?.status === 401) {
        // Access token expired, refresh the token and retry the request
        if (url.includes("user/refresh")) {
          const { accessToken, refreshToken } =
            await this.lmSdkCallbacks.onRefreshTokenExpired();
          this.networkLibrary.setAccessToken(accessToken);
          this.networkLibrary.setRefreshToken(refreshToken);
          this.setTokens(accessToken, refreshToken);
        } else {
          await this.networkLibrary.onRefreshAccessToken();
        }

        // Update the Authorization header with the new access token
        const updatedConfig = { ...requestConfig };
        updatedConfig.headers["Authorization"] =
          `Bearer ${this.networkLibrary.getAccessToken()}`;

        // Retry the request
        return this.makeRequest<{ data: T }>(url, updatedConfig)
          .then((refreshedResponse) => {
            return new LMResponse<T>(refreshedResponse.data.data, null, true);
          })
          .catch((error) => {
            if (error?.response && error?.response?.status >= 500) {
              return new LMResponse<T>(null, error.message, false);
            }
          });
      }

      if (error?.response && error?.response?.status) {
        return new LMResponse<T>(
          null,
          error?.response?.data?.error_message,
          false
        );
      }
    }
  }
}

export default RNNetworkLibrary;
