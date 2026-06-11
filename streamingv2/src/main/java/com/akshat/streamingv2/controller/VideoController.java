package com.akshat.streamingv2.controller;

import com.akshat.streamingv2.entity.Video;
import com.akshat.streamingv2.service.video.VideoMetaDataService;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/videos")
@RestController
public class VideoController {

    private final VideoMetaDataService videoservice;

    public VideoController(VideoMetaDataService videoservice) {
        this.videoservice = videoservice;
    }

    @GetMapping
    public List<Video> getAllVideos() {
        return videoservice.findAllVideos();
    }

    @GetMapping("/{id}")
    public Video getVideoById(@PathVariable Long id) {
        return videoservice.getVideoById(id);
    }

    @GetMapping("/email/{email}")
    public List<Video> getVideosByEmail(
            @PathVariable String email) {

        return videoservice.findByEmail(email);
    }

    @DeleteMapping("/{id}")
    public void deleteVideo(@PathVariable Long id) {
        videoservice.deleteVideo(id);
    }
}