package com.huy.ecommerce.service;

import com.huy.ecommerce.dtos.PhotoDTO;
import com.huy.ecommerce.dtos.ProductDTO;
import com.huy.ecommerce.entities.Photo;
import com.huy.ecommerce.entities.Product;
import com.huy.ecommerce.exception.ResourceNotFoundException;
import com.huy.ecommerce.repository.CategoryRepository;
import com.huy.ecommerce.repository.PhotoRepository;
import com.huy.ecommerce.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final PhotoRepository photoRepository;

    private PhotoDTO convertToPhotoDTO(Photo photo) {
        PhotoDTO photoDTO = new PhotoDTO();
        photoDTO.setPhotoId(photo.getPhotoId());
        photoDTO.setUrl(photo.getUrl());
        photoDTO.setProductId(photo.getProduct().getProductId());
        return photoDTO;
    }
    // convert to DTO
    private ProductDTO convertToDTO(Product product) {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setProductId(product.getProductId());
        productDTO.setName(product.getName());
        productDTO.setDescription(product.getDescription());
        productDTO.setPrice(product.getPrice());
        productDTO.setStockQuantity(product.getStockQuantity());
        productDTO.setCategoryId(product.getCategory().getCategoryId());
        productDTO.setThumbnailUrl(product.getThumbnailUrl());
        productDTO.setCreatedAt(product.getCreatedAt());
        productDTO.setUpdatedAt(product.getUpdatedAt());
        productDTO.setPhotoUrls(product.getPhotos().stream()
                .map(this::convertToPhotoDTO).toList());
        return productDTO;
    }

    // covert to entity
    private Product convertToEntity(ProductDTO productDTO) {
        Product product = new Product();
        product.setProductId(productDTO.getProductId());
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setStockQuantity(productDTO.getStockQuantity());
        product.setThumbnailUrl(productDTO.getThumbnailUrl());
        product.setCategory(categoryRepository.findById(productDTO.getCategoryId()).orElse(null));
        product.setCreatedAt(productDTO.getCreatedAt());
        product.setUpdatedAt(productDTO.getUpdatedAt());
        product.setPhotos(productDTO.getPhotoUrls().stream()
                .map(photoDTO -> {
                    Photo photo = new Photo();
                    photo.setPhotoId(photoDTO.getPhotoId());
                    photo.setUrl(photoDTO.getUrl());
                    photo.setProduct(product);
                    return photo;
                }).toList());
        return product;
    }

    // get all products
    public Page<ProductDTO> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page ,size);
        return productRepository.findAll(pageable).map(this::convertToDTO);
    }

    // create product
    public void createProduct(ProductDTO productDTO , MultipartFile file) throws IOException{
        try {
            // Handle file
            String uploadDir = "./uploads/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            // Generate random file name
            String originalFilename = file.getOriginalFilename();

            if (originalFilename == null) {
                throw new IllegalArgumentException("Original filename cannot be null");
            }
            String originalFileName = StringUtils.cleanPath(originalFilename);

            String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String randomFileName = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(randomFileName);
            Files.copy(file.getInputStream(), filePath);

            // Set the thumbnailUrl in the productDTO (relative path)
            productDTO.setThumbnailUrl(randomFileName);

            // Create Product entity and save to database
            Product product = new Product();
            product.setName(productDTO.getName());
            product.setDescription(productDTO.getDescription());
            product.setPrice(productDTO.getPrice());
            product.setStockQuantity(productDTO.getStockQuantity());
            product.setThumbnailUrl(productDTO.getThumbnailUrl()); // Set the saved file path
            product.setCategory(categoryRepository.findById(productDTO.getCategoryId()).orElse(null));
            product.setCreatedAt(LocalDateTime.now());
            product.setUpdatedAt(LocalDateTime.now());

            productRepository.save(product);
        } catch (IOException e) {
            throw new ResourceNotFoundException("Failed to upload file: " + e.getMessage());
        }
    }

    // update product
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Optional<Product> existingProduct = productRepository.findById(id);
        if (existingProduct.isPresent()) {
            Product product = existingProduct.get();
            product.setName(productDTO.getName());
            product.setDescription(productDTO.getDescription());
            product.setPrice(productDTO.getPrice());
            product.setStockQuantity(productDTO.getStockQuantity());
            product.setThumbnailUrl(productDTO.getThumbnailUrl());
            product.setCategory(categoryRepository.findById(productDTO.getCategoryId()).orElse(null));
            product.setUpdatedAt(LocalDateTime.now());

            productRepository.save(product);
            return convertToDTO(product);
        }else {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }

    }

    //get product by productId
    public ProductDTO getProductById(Long productId) {
       Product product = productRepository.findById(productId)
               .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
       return convertToDTO(product);
    }
}
