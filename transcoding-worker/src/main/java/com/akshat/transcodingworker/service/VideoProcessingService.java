package com.akshat.transcodingworker.service;

import java.nio.file.Path;

import org.springframework.stereotype.Service;

import com.akshat.transcodingworker.dto.message.*;
import com.akshat.transcodingworker.entity.Video;
import com.akshat.transcodingworker.enums.VideoStatus;
import com.akshat.transcodingworker.repository.VideoRepository;
import com.akshat.transcodingworker.service.storage.S3Service;
import com.akshat.transcodingworker.service.transcoding.FfmpegService;
import com.akshat.transcodingworker.producer.VideoProcessedProducer;

@Service
public class VideoProcessingService {

    private final VideoRepository videoRepository;
    private final S3Service s3Service;
    private final FfmpegService ffmpegService;
    private final VideoProcessedProducer videoProcessedProducer;

    public VideoProcessingService(
            VideoRepository videoRepository,
            S3Service s3Service,
            FfmpegService ffmpegService,
            VideoProcessedProducer videoProcessedProducer) {

        this.videoRepository = videoRepository;
        this.s3Service = s3Service;
        this.ffmpegService = ffmpegService;
        this.videoProcessedProducer = videoProcessedProducer;
    }

    public void processVideo(
            VideoProcessingMessage message) {

        Long videoId = message.getId();

        Video video = videoRepository
                .findById(videoId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Video not found with id: "
                                        + videoId));

        try {

            video.setStatus(
                    VideoStatus.PROCESSING);

            videoRepository.save(video);

            System.out.println(
                    "Video "
                            + videoId
                            + " marked as PROCESSING");

            Path downloadedFile =
                    s3Service.downloadFile(
                            message.getSourceS3Key());

            System.out.println(
                    "Downloaded file to: "
                            + downloadedFile);

            Path transcodedDirectory =
                    ffmpegService.generateHls(
                            downloadedFile);

            System.out.println(
                    "Generated HLS at: "
                            + transcodedDirectory);

            // Next step:
            String masterPLaylistKey = s3Service.uploadDirectory(transcodedDirectory);

            // Final step:
            video.setMasterPlaylistKey(masterPLaylistKey);
            video.setStatus(VideoStatus.READY);
            videoRepository.save(video);

            VideoProcessedMessage processedmessage = new VideoProcessedMessage(
                videoId,
                video.getStatus().name()
            );

            videoProcessedProducer.sendToNotifQueue(processedmessage);


        } catch (Exception e) {

            video.setStatus(
                    VideoStatus.FAILED);

            videoRepository.save(video);

            throw new RuntimeException(
                    "Video processing failed for id: "
                            + videoId,
                    e);
        }
    }
}