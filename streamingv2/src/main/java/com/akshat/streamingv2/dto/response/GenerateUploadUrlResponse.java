package com.akshat.streamingv2.dto.response;

public class GenerateUploadUrlResponse {
    private String uploadUrl;
    private String objectKey;


    public GenerateUploadUrlResponse() {
    }

    public GenerateUploadUrlResponse(String uploadUrl, String objectKey) {
        this.uploadUrl = uploadUrl;
        this.objectKey = objectKey;
    }

    public String getUploadUrl() {
        return uploadUrl;
    }

    public void setUploadUrl(String uploadUrl) {
        this.uploadUrl = uploadUrl;
    }

    public String getObjectKey() {
        return objectKey;
    }

    public void setObjectKey(String objectKey) {
        this.objectKey = objectKey;
    }
}
