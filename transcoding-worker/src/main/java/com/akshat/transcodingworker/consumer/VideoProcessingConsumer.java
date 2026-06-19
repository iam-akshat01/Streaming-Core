package com.akshat.transcodingworker.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.akshat.transcodingworker.config.RabbitMqConfig;
import com.akshat.transcodingworker.dto.message.VideoProcessingMessage;
import com.akshat.transcodingworker.service.VideoProcessingService;

@Component
public class VideoProcessingConsumer {

    private final VideoProcessingService videoProcessingService;

    public VideoProcessingConsumer(
            VideoProcessingService videoProcessingService) {

        this.videoProcessingService = videoProcessingService;
    }

    @RabbitListener(
            queues = RabbitMqConfig.TRANSCODING_QUEUE)
    public void processVideo(
            VideoProcessingMessage message) {

        System.out.println(
                "Received message: " + message);

        videoProcessingService.processVideo(message);
    }
}