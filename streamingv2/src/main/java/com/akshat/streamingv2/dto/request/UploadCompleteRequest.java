package com.akshat.streamingv2.dto.request;

public class UploadCompleteRequest {

    private String title;
    private String description;
    private String originalFilename;
    private String sourceS3Key;
    private String uploadedBy;
    private String email;

    public UploadCompleteRequest() {
    }

    public UploadCompleteRequest(
            String title,
            String description,
            String originalFilename,
            String sourceS3Key,
            String uploadedBy,
            String email) {

        this.title = title;
        this.description = description;
        this.originalFilename = originalFilename;
        this.sourceS3Key = sourceS3Key;
        this.uploadedBy = uploadedBy;
        this.email = email;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public String getSourceS3Key() {
        return sourceS3Key;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public String getEmail() {
        return email;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public void setSourceS3Key(String sourceS3Key) {
        this.sourceS3Key = sourceS3Key;
    }

    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}