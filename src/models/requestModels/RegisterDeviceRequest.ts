class RegisterDeviceRequest {
    // Properties of the request class
    token: string;
    deviceId: string;
  
    // Public constructor to create the request object
    constructor(token: string, deviceId: string) {
      this.token = token;
      this.deviceId = deviceId;
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
    // Add other properties as needed
  
    public setToken(token: string): RegisterDeviceRequestBuilder {
      this.token = token;
      return this;
    }
  
    public setDeviceId(deviceId: string): RegisterDeviceRequestBuilder {
      this.deviceId = deviceId;
      return this;
    }
  
    // Build method to create the final RegisterDeviceRequest object
    public build(): RegisterDeviceRequest {
      if (!this.token || !this.deviceId) {
        throw new Error("UUID and DeviceI are required.");
      }
  
      return new RegisterDeviceRequest(this.token, this.deviceId);
    }
  }
  
  export default RegisterDeviceRequest;
  