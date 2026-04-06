package com.akshat.streaming.repository;

import com.akshat.streaming.model.Video;
import java.io.FileWriter;
import java.io.IOException;
import java.io.File;
import java.util.Scanner;
import java.util.ArrayList;

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

    public ArrayList<Video> getAllVideos() {
        ArrayList<Video> videoList = new ArrayList<>();

        try {
            File file = new File(FILE_PATH);
            Scanner reader = new Scanner(file);

            while (reader.hasNextLine()) {
                String line = reader.nextLine();

                if (line.trim().isEmpty()) continue; // skip empty lines

                String[] data = line.split(",");

                // ensure correct format
                if (data.length != 7) continue;

                int id = Integer.parseInt(data[0]);
                String title = data[1];
                String description = data[2];
                String url = data[3];
                String creator = data[4];
                double duration = Double.parseDouble(data[5]);
                double size = Double.parseDouble(data[6]);

                Video video = new Video(id, description, title, url, creator, duration, size);
                videoList.add(video);
            }

            reader.close();

        } catch (IOException e) {
            System.out.println("Error reading videos.");
            e.printStackTrace();
        }

        return videoList;
    }
}  