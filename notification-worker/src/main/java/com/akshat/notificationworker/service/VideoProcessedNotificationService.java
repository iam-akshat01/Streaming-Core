package com.akshat.notificationworker.service;

import org.springframework.stereotype.Service;

import com.akshat.notificationworker.dto.message.VideoProcessedMessage;

@Service
public class VideoProcessedNotificationService {

    private final EmailService emailService;

    public VideoProcessedNotificationService(
            EmailService emailService) {

        this.emailService = emailService;
    }

    public void handleVideoProcessed(
            VideoProcessedMessage message) {

        emailService.sendVideoReadyEmail(
                message.getEmail(),
                message.getTitle()
        );
    }
}