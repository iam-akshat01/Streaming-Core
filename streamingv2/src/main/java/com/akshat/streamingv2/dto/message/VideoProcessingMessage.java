package com.akshat.streamingv2.dto.message;

public class VideoProcessingMessage {

    private Long id;
    private String sourceS3Key;
    private String email;

    public VideoProcessingMessage() {
    }

    public VideoProcessingMessage(
            Long id,
            String sourceS3Key,
            String email) {

        this.id = id;
        this.sourceS3Key = sourceS3Key;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSourceS3Key() {
        return sourceS3Key;
    }

    public void setSourceS3Key(String sourceS3Key) {
        this.sourceS3Key = sourceS3Key;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "VideoProcessingMessage{" +
                "id=" + id +
                ", sourceS3Key='" + sourceS3Key + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}