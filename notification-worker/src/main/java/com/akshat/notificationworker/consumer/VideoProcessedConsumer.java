package com.akshat.notificationworker.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.akshat.notificationworker.config.RabbitMqConfig;
import com.akshat.notificationworker.dto.message.VideoProcessedMessage;
import com.akshat.notificationworker.service.VideoProcessedNotificationService;

@Component
public class VideoProcessedConsumer {
        private final VideoProcessedNotificationService notificationService;

        public VideoProcessedConsumer(VideoProcessedNotificationService notificationService){
                this.notificationService = notificationService;
        }

    @RabbitListener(
            queues = RabbitMqConfig.NOTIFICATION_QUEUE)
    public void receiveMessage(
            VideoProcessedMessage message) {

        System.out.println(
        "Received notification event: "
                + message);

        notificationService
                .handleVideoProcessed(message);
    }
}