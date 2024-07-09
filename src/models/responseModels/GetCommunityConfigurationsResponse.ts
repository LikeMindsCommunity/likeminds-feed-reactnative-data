interface JSONObject {
    [key: string]: any;
  }
  
  enum ConfigurationType {
    MEDIA_LIMITS = "media_limits",
    FEED_METADATA = "feed_metadata",
    PROFILE_METADATA = "profile_metadata",
    NSFW_FILTERING = "nsfw_filtering",
    WIDGETS_METADATA = "widgets_metadata",
    GUEST_FLOW_METADATA = "guest_flow_metadata",
    // Add more configuration types if needed
  }
  
  interface Configuration {
    description: string;
    type: ConfigurationType;
    value: JSONObject;
  }
  
  export interface GetCommunityConfigurationsResponse {
    community_configurations: Configuration[];
  }
  