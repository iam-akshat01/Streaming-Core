package com.akshat.notificationworker.dto.message;

public class VideoProcessedMessage {

    private Long videoId;

    private String email;

    private String title;

    private String status;

    public VideoProcessedMessage() {
    }

    public VideoProcessedMessage(
            Long videoId,
            String email,
            String title,
            String status) {

        this.videoId = videoId;
        this.email = email;
        this.title = title;
        this.status = status;
    }

    public Long getVideoId() {
        return videoId;
    }

    public void setVideoId(Long videoId) {
        this.videoId = videoId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "VideoProcessedMessage{" +
                "videoId=" + videoId +
                ", email='" + email + '\'' +
                ", title='" + title + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}