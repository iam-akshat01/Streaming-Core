package com.akshat.streamingv2.service.video;

import org.springframework.stereotype.Service;

import com.akshat.streamingv2.dto.request.UploadCompleteRequest;
import com.akshat.streamingv2.dto.response.UploadCompleteResponse;
import com.akshat.streamingv2.entity.Video;
import com.akshat.streamingv2.enums.VideoStatus;
import com.akshat.streamingv2.producer.VideoProducer;
import com.akshat.streamingv2.repository.VideoRepository;
import com.akshat.streamingv2.dto.message.VideoProcessingMessage;

import java.time.Instant;
import java.util.List;

@Service
public class VideoMetaDataService {

    private final VideoRepository videoRepository;
    private final VideoProducer videoProducer;

    public VideoMetaDataService(VideoRepository repo, VideoProducer videoProducer) {
        this.videoRepository = repo;
        this.videoProducer = videoProducer;
    }

    public void saveVideo(Video video) {
        videoRepository.save(video);
    }

    public Video getVideoById(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Video not found with id: " + id));
    }

    public void deleteVideo(Long id) {
        videoRepository.deleteById(id);
    }

    public List<Video> findAllVideos() {
        return videoRepository.findAll();
    }

    public List<Video> findByEmail(String email) {
        return videoRepository.findByEmail(email);
    }

    public UploadCompleteResponse uploadVideo(
            UploadCompleteRequest request) {

        Video video = new Video();

        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());
        video.setOriginalFilename(request.getOriginalFilename());
        video.setSourceS3Key(request.getSourceS3Key());
        video.setUploadedBy(request.getUploadedBy());
        video.setEmail(request.getEmail());

        video.setStatus(VideoStatus.UPLOADED);
        video.setUploadedAt(Instant.now());

        Video savedVideo = videoRepository.save(video);

        VideoProcessingMessage message = new VideoProcessingMessage(
                savedVideo.getId(),
                savedVideo.getSourceS3Key(),
                savedVideo.getEmail()
        );

        videoProducer.sendToTranscodingQueue(message);

        return new UploadCompleteResponse(
                savedVideo.getId(),
                savedVideo.getEmail(),
                "Video uploaded successfully"
        );
    }
}