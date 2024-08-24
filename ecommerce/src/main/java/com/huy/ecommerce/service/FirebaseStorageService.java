package com.huy.ecommerce.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.StorageClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;


@Service
public class FirebaseStorageService {

    @PostConstruct
    public void initialize() {
        try {
            InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("apiKeyFirebase.json");
            if (serviceAccount == null) {
                throw new IOException("File not found");
            }
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setStorageBucket("commerce-4156e.appspot.com")
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String uploadFile(MultipartFile multipartFile, String folderPath) {
        try {
            String fileName = UUID.randomUUID() + "." + getFileExtension(multipartFile.getOriginalFilename());
            String fullPath = folderPath + "/" + fileName;

            Bucket bucket = StorageClient.getInstance().bucket();
            BlobId blobId = BlobId.of(bucket.getName(), fullPath);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                    .setContentType(multipartFile.getContentType())
                    .build();

            Storage storage = StorageOptions.newBuilder()
                    .setCredentials(GoogleCredentials.fromStream(getClass().getClassLoader().getResourceAsStream("apiKeyFirebase.json")))
                    .build()
                    .getService();

            storage.create(blobInfo, multipartFile.getBytes());

            return fullPath;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private String getFileExtension(String fileName) {
        if (fileName != null && fileName.lastIndexOf(".") != -1) {
            return fileName.substring(fileName.lastIndexOf(".") + 1);
        }
        return "";
    }

    public String getBucketName() {
        return "commerce-4156e.appspot.com";
    }
}
