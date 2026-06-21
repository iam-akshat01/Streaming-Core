package com.akshat.transcodingworker.service.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class S3Service {

        private final S3Client s3Client;

        @Value("${aws.bucket-name}")
        private String bucketName;

        @Value("${worker.download-dir}")
        private String downloadDir;

        public S3Service(S3Client s3Client) {
                this.s3Client = s3Client;
        }

        public Path downloadFile(String sourceS3Key) throws IOException {
                Files.createDirectories(Paths.get(downloadDir));

                String originalFileName = Paths.get(sourceS3Key)
                                .getFileName()
                                .toString();

                String uniqueFileName = UUID.randomUUID() + "-" + originalFileName;

                Path filePath = Paths.get(downloadDir, uniqueFileName);

                System.out.println("Downloading " + sourceS3Key + " to " + filePath);

                GetObjectRequest request = GetObjectRequest.builder()
                                .bucket(bucketName)
                                .key(sourceS3Key)
                                .build();

                s3Client.getObject(request, filePath);

                return filePath;
        }

        public String uploadDirectory(Path transcodedFolderDirectory) {

                String s3FolderPath = "hls/"
                                + transcodedFolderDirectory
                                                .getFileName()
                                                .toString()
                                + "/";

                String masterPlaylistKey = null;

                try (Stream<Path> paths = Files.walk(transcodedFolderDirectory)) {

                        for (Path filePath : paths
                                        .filter(Files::isRegularFile)
                                        .toList()) {

                                Path relativePath = transcodedFolderDirectory
                                                .relativize(filePath);

                                String s3Key = s3FolderPath
                                                + relativePath.toString()
                                                                .replace("\\", "/");

                                String fileName = filePath.getFileName()
                                                .toString();

                                String contentType = "application/octet-stream";

                                if (fileName.endsWith(".m3u8")) {

                                        contentType = "application/x-mpegURL";

                                        if (fileName.equalsIgnoreCase("master.m3u8")) {
                                                masterPlaylistKey = s3Key;
                                        }

                                } else if (fileName.endsWith(".ts")) {

                                        contentType = "video/MP2T";
                                }

                                PutObjectRequest request = PutObjectRequest.builder()
                                                .bucket(bucketName)
                                                .key(s3Key)
                                                .contentType(contentType)
                                                .build();

                                s3Client.putObject(
                                                request,
                                                RequestBody.fromFile(filePath));

                                System.out.println(
                                                "Uploaded: " + s3Key);
                        }

                } catch (IOException e) {

                        throw new RuntimeException(
                                        "Failed uploading HLS directory",
                                        e);
                }

                if (masterPlaylistKey == null) {

                        throw new RuntimeException(
                                        "master.m3u8 not found");
                }

                return masterPlaylistKey;
        }
}
