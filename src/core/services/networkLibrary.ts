// NetworkLibrary
import TokenManager from "@likeminds.community/feed-js/dist/core/services/tokenmanager";
import { LMSDKCallbacks } from "@likeminds.community/feed-js";
import { TokenValues } from "@likeminds.community/feed-js/dist/shared/tokens";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LMResponse from "./lmresponse";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { environment } from "../../environment";

class RNNetworkLibrary {
  private tokenManager: TokenManager;
  private xApiKey: string | null;
  private lmSdkCallbacks: LMSDKCallbacks | null;

  public setUserInLocalStorage(user: string) {
    AsyncStorage.setItem(TokenValues.LOCAL_USER, user);
  }
  public setApiKeyInLocalStorage(apiKey: string) {
    AsyncStorage.setItem(TokenValues.LOCAL_API_KEY, apiKey);
  }

  public setAccessTokenInLocalStorage(token: string) {
    AsyncStorage.setItem(TokenValues.LOCAL_ACCESS_TOKEN, token);
  }

  public setRefreshTokenInLocalStorage(token: string) {
    AsyncStorage.setItem(TokenValues.LOCAL_REFRESH_TOKEN, token);
  }

  public getAccessTokenFromRNLocalStorage() {
    return AsyncStorage.getItem(TokenValues.LOCAL_ACCESS_TOKEN);
  }

  public getRefreshTokenFromRNLocalStorage() {
    return AsyncStorage.getItem(TokenValues.LOCAL_REFRESH_TOKEN);
  }

  public getApiKeyFromRNLocalStorage() {
    return AsyncStorage.getItem(TokenValues.LOCAL_API_KEY);
  }
  public getUserFromRNLocalStorage() {
    return AsyncStorage.getItem(TokenValues.LOCAL_USER);
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
    requestConfig.headers["x-version-code"] =
      this.tokenManager.getVersionCode();

    const device = url.includes("user/device/push");
    if (!device)
      requestConfig.headers["x-platform-code"] =
        this.tokenManager.getPlatformCode();

    const cFeed = url.includes("community/feed");
    if (cFeed) requestConfig.headers["x-accept-version"] = "v2";

    const isMarkRead = url.includes("mark_read");
    if (isMarkRead)
      requestConfig.headers["Content-Type"] =
        "application/x-www-form-urlencoded";

    // Add the access token to the request headers
    // if (this.tokenManager.getAccessToken && !initApi) {
    if (this.tokenManager.getAccessToken) {
      requestConfig.headers["Authorization"] =
        `Bearer ${this.tokenManager.getAccessToken()}`;
    }

    // Add the apiKey in initiate api to the request headers
    if (initApi) {
      if (this.tokenManager.getPlatformCode() === "rn") {
        const xApiKey = await AsyncStorage.getItem("xApiKey");
        if (xApiKey && xApiKey.length) {
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
          // TODO expose functions for storing tokens from DL
          // done
          this.tokenManager.setAccessToken(accessToken);
          this.tokenManager.setRefreshToken(refreshToken);
          // TODO add tokens in local storage too
          // done
          this.setAccessTokenInLocalStorage(accessToken);
          this.setRefreshTokenInLocalStorage(refreshToken);
        } else {
          await this.tokenManager.refreshAccessToken();
        }

        // Update the Authorization header with the new access token
        const updatedConfig = { ...requestConfig };
        updatedConfig.headers["Authorization"] =
          `Bearer ${this.tokenManager.getAccessToken()}`;

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

      if (error?.response && error?.response?.status >= 500) {
        return new LMResponse<T>(null, error.message, false);
      }
    }
  }
}

export default RNNetworkLibrary;