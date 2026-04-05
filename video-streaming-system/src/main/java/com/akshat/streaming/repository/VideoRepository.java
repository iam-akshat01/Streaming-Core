package com.akshat.streaming.repository;

import com.akshat.streaming.model.Video;
import java.io.FileWriter;
import java.io.IOException;

public class VideoRepository {

    private static final String FILE_PATH = "data/videos.txt";

    public void saveVideo(Video video) {
        try (FileWriter writer = new FileWriter(FILE_PATH, true)) {
            writer.write(video.toString() + "\n");
        } catch (IOException e) {
            System.out.println("Error saving video.");
            e.printStackTrace();
        }
    }
}