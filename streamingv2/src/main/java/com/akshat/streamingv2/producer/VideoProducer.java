package com.akshat.streamingv2.producer;

import com.akshat.streamingv2.config.RabbitMqConfig;
import com.akshat.streamingv2.dto.message.VideoProcessingMessage;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class VideoProducer {

    private final RabbitTemplate rabbitTemplate;

    public VideoProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendToTranscodingQueue(VideoProcessingMessage message) {

        rabbitTemplate.convertAndSend(
                RabbitMqConfig.EXCHANGE_NAME,
                RabbitMqConfig.TRANSCODING_ROUTING_KEY,
                message
        );

        System.out.println(
                "Published video processing message: " + message
        );
    }
}