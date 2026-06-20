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
                    "Generating Multi-Bitrate HLS for "
                            + inputFile);

            List<String> command = new ArrayList<>();

            command.add("ffmpeg");

            command.add("-i");
            command.add(inputFile.toString());

            command.add("-filter_complex");
            command.add("[0:v]split=3[v1][v2][v3]; [v1]scale=-2:1080[v1out]; [v2]scale=-2:720[v2out]; [v3]scale=-2:480[v3out]");

            command.add("-map"); command.add("[v1out]");
            command.add("-c:v:0"); command.add("libx264");
            command.add("-b:v:0"); command.add("5000k");

            command.add("-map"); command.add("[v2out]");
            command.add("-c:v:1"); command.add("libx264");
            command.add("-b:v:1"); command.add("2800k");

            command.add("-map"); command.add("[v3out]");
            command.add("-c:v:2"); command.add("libx264");
            command.add("-b:v:2"); command.add("1400k");

            command.add("-map"); command.add("0:a");
            command.add("-c:a"); command.add("aac");
            command.add("-b:a"); command.add("128k");

            command.add("-f");
            command.add("hls");

            command.add("-hls_time");
            command.add("10");

            command.add("-hls_list_size");
            command.add("0");

            command.add("-var_stream_map");
            command.add("v:0,a:0 v:1,a:0 v:2,a:0");

            command.add("-hls_segment_filename");
            command.add(
                    outputDirectory
                            .resolve("%v/segment_%05d.ts")
                            .toString());

            command.add(
                    outputDirectory
                            .resolve("master.m3u8")
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
 // 0 is 180 so its in descending order 