package com.akshat.streamingv2.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.akshat.streamingv2.entity.Video;
import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video,Long>{
    List<Video> findByEmail(String email);
}
