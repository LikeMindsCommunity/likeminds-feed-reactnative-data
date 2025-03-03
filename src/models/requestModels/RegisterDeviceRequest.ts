class RegisterDeviceRequest {
    // Properties of the request class
    token: string;
    deviceId: string;
    platformCode: string;
  
    // Public constructor to create the request object
    constructor(token: string, deviceId: string, platformCode: string) {
      this.token = token;
      this.deviceId = deviceId;
      this.platformCode = platformCode
    }
  
    // Static builder method to create the request object
    public static builder(): RegisterDeviceRequestBuilder {
      return new RegisterDeviceRequestBuilder();
    }
  }
  
  // Builder class for RegisterDeviceRequest
  export class RegisterDeviceRequestBuilder {
    private token: string | undefined;
    private deviceId: string | undefined;
    private platformCode: string;
    // Add other properties as needed
  
    public setToken(token: string): RegisterDeviceRequestBuilder {
      this.token = token;
      return this;
    }
  
    public setDeviceId(deviceId: string): RegisterDeviceRequestBuilder {
      this.deviceId = deviceId;
      return this;
    }

    public setPlatformCode(platformCode: string): RegisterDeviceRequestBuilder {
      this.platformCode = platformCode;
      return this;
    }
  
    // Build method to create the final RegisterDeviceRequest object
    public build(): RegisterDeviceRequest {
      if (!this.token || !this.deviceId) {
        throw new Error("UUID and DeviceID are required.");
      }

      if (!this.platformCode) {
        throw new Error("Platform code is required.");
      }
  
      return new RegisterDeviceRequest(this.token, this.deviceId, this.platformCode);
    }
  }
  
  export default RegisterDeviceRequest;
  