package com.akshat.transcodingworker.producer;

import com.akshat.transcodingworker.config.RabbitMqConfig;
import com.akshat.transcodingworker.dto.message.VideoProcessedMessage;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class VideoProcessedProducer {

    private final RabbitTemplate rabbitTemplate;

    public VideoProcessedProducer(
            RabbitTemplate rabbitTemplate) {

        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendToNotifQueue(
            VideoProcessedMessage message) {

        rabbitTemplate.convertAndSend(
                RabbitMqConfig.EXCHANGE_NAME,
                RabbitMqConfig.NOTIFICATION_ROUTING_KEY,
                message
        );

        System.out.println(
                "Published video processed event: "
                        + message.getVideoId()
        );
    }
}