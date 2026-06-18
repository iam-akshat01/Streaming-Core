package com.akshat.streamingv2.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.akshat.streamingv2.dto.message.VideoProcessingMessage;
import com.akshat.streamingv2.producer.VideoProducer;

@RestController
public class TestController {

    private final VideoProducer videoProducer;

    public TestController(VideoProducer videoProducer) {
        this.videoProducer = videoProducer;
    }

    @GetMapping("/test-publish")
    public String testPublish() {

        VideoProcessingMessage message =
                new VideoProcessingMessage(
                        1L,
                        "uploads/test.mp4",
                        "test@gmail.com"
                );

        videoProducer.sendToTranscodingQueue(message);

        return "Message Published";
    }
}