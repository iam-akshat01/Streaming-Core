package com.akshat.streamingv2.service.s3;

import java.time.Duration;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.akshat.streamingv2.dto.request.GenerateUploadUrlRequest;
import com.akshat.streamingv2.dto.response.GenerateUploadUrlResponse;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@Service
public class S3Service {

    private final S3Presigner s3Presigner;

    private final S3Client s3Client;

    @Value("${aws.bucket-name}")
    private String bucketName;

    public S3Service(
            S3Presigner s3Presigner,
            S3Client s3Client) {

        this.s3Presigner = s3Presigner;
        this.s3Client = s3Client;
    }

    public GenerateUploadUrlResponse generateUploadUrl(
            GenerateUploadUrlRequest request) {

        String fileName = request.getFilename();

        String contentType = request.getContentType();

        String objectKey =
                "uploads/"
                + UUID.randomUUID()
                + "/"
                + fileName;

        PutObjectRequest putObjectRequest =
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(objectKey)
                        .contentType(contentType)
                        .build();

        PutObjectPresignRequest presignRequest =
                PutObjectPresignRequest.builder()
                        .signatureDuration(Duration.ofMinutes(15))
                        .putObjectRequest(putObjectRequest)
                        .build();

        PresignedPutObjectRequest presignedRequest =
                s3Presigner.presignPutObject(presignRequest);

        return new GenerateUploadUrlResponse(
                presignedRequest.url().toString(),
                objectKey
        );
    }
}