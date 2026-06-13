package com.akshat.streamingv2.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;

@Configuration
public class RabbitMqConfig {

    public static final String EXCHANGE_NAME = "streaming-exchange";

    public static final String TRANSCODING_QUEUE = "transcoding-queue";
    public static final String NOTIFICATION_QUEUE = "notification-queue";

    public static final String TRANSCODING_ROUTING_KEY = "video.transcode";
    public static final String NOTIFICATION_ROUTING_KEY = "video.notification";

    @Bean
    public RabbitAdmin rabbitAdmin(ConnectionFactory connectionFactory) {
    return new RabbitAdmin(connectionFactory);
    }

    @Bean
    public TopicExchange videoExchange() {
        System.out.println("Creating exchange bean");
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue transcodingQueue() {
        System.out.println("Creating transcoding queue bean");
        return new Queue(TRANSCODING_QUEUE);
    }

    @Bean
    public Queue notificationQueue() {
        System.out.println("Creating notification queue bean");
        return new Queue(NOTIFICATION_QUEUE);
    }

    @Bean
    public Binding transcodingBinding() {
        return BindingBuilder
                .bind(transcodingQueue())
                .to(videoExchange())
                .with(TRANSCODING_ROUTING_KEY);
    }

    @Bean
    public Binding notificationBinding() {
        return BindingBuilder
                .bind(notificationQueue())
                .to(videoExchange())
                .with(NOTIFICATION_ROUTING_KEY);
    }
}