package com.akshat.streamingv2.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.akshat.streamingv2.dto.request.GenerateUploadUrlRequest;
import com.akshat.streamingv2.dto.response.GenerateUploadUrlResponse;
import com.akshat.streamingv2.dto.request.UploadCompleteRequest;
import com.akshat.streamingv2.dto.response.UploadCompleteResponse;
import com.akshat.streamingv2.service.s3.S3Service;
import com.akshat.streamingv2.service.video.VideoMetaDataService;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private final S3Service s3Service;
    private final VideoMetaDataService videoMetaDataService;
    public UploadController(S3Service s3Service, VideoMetaDataService videoMetaDataService) {
        this.videoMetaDataService = videoMetaDataService;
        this.s3Service = s3Service;
    }

    @PostMapping("/url")
    public GenerateUploadUrlResponse generateUploadUrl(
            @RequestBody GenerateUploadUrlRequest request) {

        return s3Service.generateUploadUrl(request);
    }

    @PostMapping("/complete")
    public UploadCompleteResponse completeUpload(
            @RequestBody UploadCompleteRequest request
    ){
        return videoMetaDataService.uploadVideo(request);
    }
}
