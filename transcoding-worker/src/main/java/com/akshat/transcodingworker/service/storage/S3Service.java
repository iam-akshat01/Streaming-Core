package com.akshat.transcodingworker.service.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

@Service
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.bucket-name}")
    private String bucketName;

    @Value("${worker.download-dir}")
    private String downloadDir;

    public S3Service(
            S3Client s3Client) {

        this.s3Client = s3Client;
    }

    public Path downloadFile(
            String sourceS3Key)
            throws IOException {

        Files.createDirectories(
                Paths.get(downloadDir));

        String originalFileName =
                Paths.get(sourceS3Key)
                        .getFileName()
                        .toString();

        String uniqueFileName =
                UUID.randomUUID()
                        + "-"
                        + originalFileName;

        Path filePath =
                Paths.get(
                        downloadDir,
                        uniqueFileName);

        System.out.println(
                "Downloading "
                        + sourceS3Key
                        + " to "
                        + filePath);

        GetObjectRequest request =
                GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(sourceS3Key)
                        .build();

        s3Client.getObject(
                request,
                filePath);

        return filePath;
    }
}