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

            // 1. FILTER COMPLEX: Splits and scales safely across both landscape and portrait configurations
            command.add("-filter_complex");
            command.add("[0:v]split=3[v1][v2][v3]; [v1]scale=1080:-2[v1out]; [v2]scale=720:-2[v2out]; [v3]scale=480:-2[v3out]; [0:a]asplit=3[a1][a2][a3]");

            // ---- VARIANT 0 (1080p Profile) ----
            command.add("-map"); command.add("[v1out]");
            command.add("-c:v:0"); command.add("libx264");
            command.add("-b:v:0"); command.add("5000k");
            
            command.add("-map"); command.add("[a1]");
            command.add("-c:a:0"); command.add("aac");
            command.add("-b:a:0"); command.add("128k");

            // ---- VARIANT 1 (720p Profile) ----
            command.add("-map"); command.add("[v2out]");
            command.add("-c:v:1"); command.add("libx264");
            command.add("-b:v:1"); command.add("2800k");
            
            command.add("-map"); command.add("[a2]");
            command.add("-c:a:1"); command.add("aac");
            command.add("-b:a:1"); command.add("128k");

            // ---- VARIANT 2 (480p Profile) ----
            command.add("-map"); command.add("[v3out]");
            command.add("-c:v:2"); command.add("libx264");
            command.add("-b:v:2"); command.add("1400k");
            
            command.add("-map"); command.add("[a3]");
            command.add("-c:a:2"); command.add("aac");
            command.add("-b:a:2"); command.add("128k");

            // 2. PACKAGING STREAM CONFIGURATIONS
            command.add("-f");
            command.add("hls");

            command.add("-hls_time");
            command.add("10");

            command.add("-hls_list_size");
            command.add("0");

            // 3. ADAPTIVE VARIANT LINKING: Groups distinct video targets to matching distinct audio instances
            command.add("-var_stream_map");
            command.add("v:0,a:0 v:1,a:1 v:2,a:2");

            // 4. PATH NORMALIZATION FIX: Forces standard linux slashes to stop Windows shell token matching errors
            String baseCleanPath = outputDirectory.toAbsolutePath().toString().replace("\\", "/");

            command.add("-master_pl_name");
                command.add("master.m3u8");

                command.add("-hls_segment_filename");
                command.add(baseCleanPath + "/%v/segment_%05d.ts");

                command.add(baseCleanPath + "/%v/prog_index.m3u8");
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
