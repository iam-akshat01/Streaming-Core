package com.akshat.streamingv2.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    public static final String EXCHANGE_NAME =
            "streaming-exchange";

    public static final String TRANSCODING_QUEUE =
            "transcoding-queue";

    public static final String NOTIFICATION_QUEUE =
            "notification-queue";

    public static final String TRANSCODING_ROUTING_KEY =
            "video.transcode";

    public static final String NOTIFICATION_ROUTING_KEY =
            "video.notification";

    @Bean
    public RabbitAdmin rabbitAdmin(ConnectionFactory connectionFactory) {
        return new RabbitAdmin(connectionFactory);
    }

    @Bean
    public TopicExchange videoExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue transcodingQueue() {
        return new Queue(TRANSCODING_QUEUE, true);
    }

    @Bean
    public Queue notificationQueue() {
        return new Queue(NOTIFICATION_QUEUE, true);
    }

    @Bean
    public Binding transcodingBinding(
            Queue transcodingQueue,
            TopicExchange videoExchange) {

        return BindingBuilder
                .bind(transcodingQueue)
                .to(videoExchange)
                .with(TRANSCODING_ROUTING_KEY);
    }

    @Bean
    public Binding notificationBinding(
            Queue notificationQueue,
            TopicExchange videoExchange) {

        return BindingBuilder
                .bind(notificationQueue)
                .to(videoExchange)
                .with(NOTIFICATION_ROUTING_KEY);
    }
}