package com.akshat.streaming.app;

import com.akshat.streaming.controller.VideoController;
import com.akshat.streaming.model.Video;
import java.util.ArrayList;

public class MainApp {

    public static void main(String[] args) {

        VideoController controller = new VideoController();

        // Create videos
        Video v1 = new Video(1, "Intro video", "Intro", "url1", "Akshat", 120.5, 50.0);
        Video v2 = new Video(2, "Demo video", "Demo", "url2", "Akshat", 200.0, 75.0);

        // Add videos
        controller.addVideo(v1);
        controller.addVideo(v2);

        // Fetch all videos
        ArrayList<Video> videos = controller.getAllVideos();

        // Print videos
        for (Video v : videos) {
            System.out.println(v);
        }
    }
}