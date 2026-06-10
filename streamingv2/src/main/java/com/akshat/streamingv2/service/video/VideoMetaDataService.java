package com.akshat.streamingv2.service.video;

import org.springframework.stereotype.Service;
import com.akshat.streamingv2.repository.VideoRepository;
import com.akshat.streamingv2.entity.Video;
import java.util.List;

@Service
public class VideoMetaDataService {
    private final VideoRepository videoRepository;

    public VideoMetaDataService(VideoRepository repo) {
        this.videoRepository = repo;
    } 

    public void saveVideo(Video video) {
        videoRepository.save(video);
    }

    public Video getVideoById(Long id) {
        return videoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Video not found with id: " + id));
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
}
