package com.akshat.streamingv2.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;

import org.springframework.stereotype.Component;

import com.akshat.streamingv2.config.RabbitMqConfig;

import com.akshat.streamingv2.dto.message.VideoProcessingMessage;

import com.akshat.streamingv2.entity.Video;

import com.akshat.streamingv2.enums.VideoStatus;

import com.akshat.streamingv2.service.video.VideoMetaDataService;

@Component

public class VideoProcessingConsumer {

    private final VideoMetaDataService service;

    public VideoProcessingConsumer(

            VideoMetaDataService service) {

        this.service = service;

    }

    @RabbitListener(

            queues = RabbitMqConfig.TRANSCODING_QUEUE)

    public void afterJobSchedulingService(

            VideoProcessingMessage message) {

        System.out.println(

                "Received video id: "

                        + message.getId());

        Long videoId = message.getId();

        Video video =

                service.getVideoById(videoId);

        video.setStatus(

                VideoStatus.PROCESSING);

        service.saveVideo(video);

        System.out.println(

                "Video "

                        + videoId

                        + " status updated to PROCESSING");

    }

}
