class RegisterDeviceRequest {
    // Properties of the request class
    token: string;
    deviceId: string;
    platform: string;
  
    // Public constructor to create the request object
    constructor(token: string, deviceId: string, platform: string) {
      this.token = token;
      this.deviceId = deviceId;
      this.platform = platform
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
    private platform: string;
    // Add other properties as needed
  
    public setToken(token: string): RegisterDeviceRequestBuilder {
      this.token = token;
      return this;
    }
  
    public setDeviceId(deviceId: string): RegisterDeviceRequestBuilder {
      this.deviceId = deviceId;
      return this;
    }

    public setPlatform(platform: string): RegisterDeviceRequestBuilder {
      this.platform = platform;
      return this;
    }
  
    // Build method to create the final RegisterDeviceRequest object
    public build(): RegisterDeviceRequest {
      if (!this.token || !this.deviceId) {
        throw new Error("UUID and DeviceI are required.");
      }

      if (!this.platform) {
        throw new Error("Platform code is required.");
      }
  
      return new RegisterDeviceRequest(this.token, this.deviceId, this.platform);
    }
  }
  
  export default RegisterDeviceRequest;
  