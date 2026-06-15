package com.akshat.transcodingworker.service.transcoding;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FfmpegService {

    @Value("${worker.transcoded-dir}")
    private String transcodedDir;

    public Path generateHls(Path inputFile) {

        try {

            if (!Files.exists(inputFile)) {
                throw new RuntimeException(
                        "Input file does not exist: "
                                + inputFile);
            }

            Path parentFolder = Path.of(transcodedDir);

            String originalFileName = inputFile.getFileName()
                    .toString();

            String fileNameWithoutExtension = originalFileName.contains(".")
                    ? originalFileName.substring(
                            0,
                            originalFileName.lastIndexOf('.'))
                    : originalFileName;

            String outputFolderName = UUID.randomUUID()
                    + "-"
                    + fileNameWithoutExtension;

            Path outputDirectory = parentFolder.resolve(
                    outputFolderName);

            Files.createDirectories(
                    outputDirectory);

            System.out.println(
                    "Generating HLS for "
                            + inputFile);

            List<String> command = new ArrayList<>();

            command.add("ffmpeg");

            command.add("-i");
            command.add(inputFile.toString());

            command.add("-vf");
            command.add("scale=-2:480");

            command.add("-codec:v");
            command.add("libx264");

            command.add("-codec:a");
            command.add("aac");

            command.add("-f");
            command.add("hls");

            command.add("-hls_time");
            command.add("10");

            command.add("-hls_list_size");
            command.add("0");

            command.add("-hls_segment_filename");
            command.add(
                    outputDirectory
                            .resolve("segment_%03d.ts")
                            .toString());

            command.add(
                    outputDirectory
                            .resolve("index.m3u8")
                            .toString());

            ProcessBuilder processBuilder = new ProcessBuilder(command);

            processBuilder.inheritIO();

            Process process = processBuilder.start();

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new RuntimeException(
                        "FFmpeg exited with code: "
                                + exitCode);
            }

            return outputDirectory;

        } catch (IOException | InterruptedException e) {

            if (e instanceof InterruptedException) {
                Thread.currentThread()
                        .interrupt();
            }

            throw new RuntimeException(
                    "Failed to generate HLS",
                    e);
        }
    }
}