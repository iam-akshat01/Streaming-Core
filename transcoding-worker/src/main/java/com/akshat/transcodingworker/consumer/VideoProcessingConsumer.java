package com.akshat.transcodingworker.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.akshat.transcodingworker.config.RabbitMqConfig;
import com.akshat.transcodingworker.dto.message.VideoProcessingMessage;

@Component
public class VideoProcessingConsumer {

    @RabbitListener(
            queues = RabbitMqConfig.TRANSCODING_QUEUE)
    public void processVideo(
            VideoProcessingMessage message) {

        System.out.println(message);
    }
}