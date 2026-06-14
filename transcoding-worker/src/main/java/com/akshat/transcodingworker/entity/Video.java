package com.akshat.transcodingworker.entity;

import java.time.Instant;

import com.akshat.transcodingworker.enums.VideoStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "videos")

public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String originalFilename;

    private String sourceS3Key;

    private String uploadedBy;

    private String email;

    private Long size;

    private Double duration;

    private String masterPlaylistKey;

    @Enumerated(EnumType.STRING)
    private VideoStatus status;

    private Instant uploadedAt;

    public Video() {
    }

    public Video(Long id,
                 String title,
                 String description,
                 String originalFilename,
                 String sourceS3Key,
                 String uploadedBy,
                 String email,
                 Long size,
                 Double duration,
                 String masterPlaylistKey,
                 VideoStatus status,
                 Instant uploadedAt) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.originalFilename = originalFilename;
        this.sourceS3Key = sourceS3Key;
        this.uploadedBy = uploadedBy;
        this.email = email;
        this.size = size;
        this.duration = duration;
        this.masterPlaylistKey = masterPlaylistKey;
        this.status = status;
        this.uploadedAt = uploadedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public String getSourceS3Key() {
        return sourceS3Key;
    }

    public void setSourceS3Key(String sourceS3Key) {
        this.sourceS3Key = sourceS3Key;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public Double getDuration() {
        return duration;
    }

    public void setDuration(Double duration) {
        this.duration = duration;
    }

    public String getMasterPlaylistKey() {
        return masterPlaylistKey;
    }

    public void setMasterPlaylistKey(String masterPlaylistKey) {
        this.masterPlaylistKey = masterPlaylistKey;
    }

    public VideoStatus getStatus() {
        return status;
    }

    public void setStatus(VideoStatus status) {
        this.status = status;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Instant uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}