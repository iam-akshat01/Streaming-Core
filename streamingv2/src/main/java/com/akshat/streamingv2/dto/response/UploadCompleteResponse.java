package com.akshat.streamingv2.dto.response;

public class UploadCompleteResponse {

    private Long id;
    private String email;
    private String message;

    public UploadCompleteResponse() {
    }

    public UploadCompleteResponse(
            Long id,
            String email,
            String message) {

        this.id = id;
        this.email = email;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getMessage() {
        return message;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}