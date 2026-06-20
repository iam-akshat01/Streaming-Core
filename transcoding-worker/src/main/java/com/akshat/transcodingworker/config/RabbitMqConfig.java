package com.akshat.transcodingworker.config;

import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    public static final String EXCHANGE_NAME = "streaming-exchange";

    public static final String TRANSCODING_QUEUE = "transcoding-queue";

    public static final String NOTIFICATION_QUEUE = "notification-queue";

    public static final String TRANSCODING_ROUTING_KEY =
            "video.transcode";

    public static final String NOTIFICATION_ROUTING_KEY =
            "video.notification";

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new JacksonJsonMessageConverter();
    }
}