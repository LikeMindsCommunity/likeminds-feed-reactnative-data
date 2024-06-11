// import { API } from "../shared/constants/api.constant";

import { InitiateUserRequest, ValidateUserRequest } from "@likeminds.community/feed-js";
import NetworkLibrary from "@likeminds.community/feed-js/dist/core/services/networklibrary";
import { API } from "@likeminds.community/feed-js/dist/shared/constants/api.constant";
import { InitiateUserResponse, ValidateUserResponse } from "@likeminds.community/feed-js/dist/shared/models/api-responses/initiateUserResponse";
import RNNetworkLibrary from "src/core/services/networkLibrary";
import { ModelConverter } from "src/utils/ModelConverter";

// import InitiateUserRequest from "./model/InitiateUserRequest";
// import { InitiateUserResponse } from "../shared/models/api-responses/initiateUserResponse";
// import NetworkLibrary from "../core/services/networklibrary";
// import { ModelConverter } from "../utils/ModelConverter";

// import { GetMemberStateResponse } from "../shared/models/api-responses/getMemberStateResponse";
// import GetAllMembersRequest from "./model/GetAllMembersRequest";
// import ValidateUserRequest from "./model/ValidateUserRequest";
// import { ValidateUserResponse } from "../shared/models/api-responses/initiateUserResponse";
// import { GetAllMembersResponse } from "../shared/models/api-responses/getAllMembersResponse";

class RNInitiateUserClient {
  private rnNetworkLibrary: RNNetworkLibrary;
  private networkLibrary: NetworkLibrary;

  constructor(networkInstance: NetworkLibrary) {
    this.networkLibrary = networkInstance;
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
}

export default RNInitiateUserClient;
