package com.akshat.streamingv2.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

        public static final String EXCHANGE_NAME = "streaming-exchange";
        public static final String TRANSCODING_QUEUE = "transcoding-queue";
        public static final String NOTIFICATION_QUEUE = "notification-queue";
        public static final String TRANSCODING_ROUTING_KEY = "video.transcode";
        public static final String NOTIFICATION_ROUTING_KEY = "video.notification";

        @Bean
        public MessageConverter jsonMessageConverter() {
                return new JacksonJsonMessageConverter();
        }

        @Bean
        public RabbitAdmin rabbitAdmin(ConnectionFactory connectionFactory) {
                return new RabbitAdmin(connectionFactory);
        }

        @Bean
        public RabbitTemplate rabbitTemplate(
                        ConnectionFactory connectionFactory,
                        MessageConverter messageConverter) {

                RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);

                rabbitTemplate.setMessageConverter(
                                messageConverter);

                return rabbitTemplate;
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
        public Binding transcodingBinding(Queue transcodingQueue, TopicExchange videoExchange) {
                return BindingBuilder
                                .bind(transcodingQueue)
                                .to(videoExchange)
                                .with(TRANSCODING_ROUTING_KEY);
        }

        @Bean
        public Binding notificationBinding(Queue notificationQueue, TopicExchange videoExchange) {
                return BindingBuilder
                                .bind(notificationQueue)
                                .to(videoExchange)
                                .with(NOTIFICATION_ROUTING_KEY);
        }
}
