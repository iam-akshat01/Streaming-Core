package com.akshat.streamingv2.dto.response;

public class StreamVideoResponse {
    private String streamUrl;
    private String title;

    public StreamVideoResponse() {}

    public StreamVideoResponse(String streamUrl, String title) {
        this.streamUrl = streamUrl;
        this.title = title;
    }

    public String getStreamingUrl() {
        return streamUrl;
    }

    public void setStreamingUrl(String streamUrl) {
        this.streamUrl = streamUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
