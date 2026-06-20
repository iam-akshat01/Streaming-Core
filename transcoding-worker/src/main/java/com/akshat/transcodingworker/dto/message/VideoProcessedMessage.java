package com.akshat.transcodingworker.dto.message;


public class VideoProcessedMessage {

    private Long videoId;

    private String status;

    public VideoProcessedMessage() {
    }

    public VideoProcessedMessage(
            Long videoId,
            String status) {

        this.videoId = videoId;
        this.status = status;
    }

    public Long getVideoId() {
        return videoId;
    }

    public void setVideoId(Long videoId) {
        this.videoId = videoId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}