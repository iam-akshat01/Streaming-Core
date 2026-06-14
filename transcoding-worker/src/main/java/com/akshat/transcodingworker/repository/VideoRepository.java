package com.akshat.transcodingworker.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.akshat.transcodingworker.entity.Video;
import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video,Long>{
    List<Video> findByEmail(String email);
}
