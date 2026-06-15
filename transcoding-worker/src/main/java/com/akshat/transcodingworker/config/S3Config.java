package com.akshat.transcodingworker.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;

@Configuration
public class S3Config {

    @Value("${aws.bucket-name}")
    private String bucketName;

    @Value("${aws.region}")
    private String region;

    @Value("${aws.access-key}")
    private String accessKey;

    @Value("${aws.secret-key}")
    private String secretKey;

    private StaticCredentialsProvider getCredentialsProvider() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
        return StaticCredentialsProvider.create(credentials);
    }

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
        .region(Region.of(region))
        .credentialsProvider(getCredentialsProvider())
        .build();
    }

}