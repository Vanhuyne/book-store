package com.huy.ecommerce.service;

import com.huy.ecommerce.dtos.PhotoDTO;
import com.huy.ecommerce.dtos.ProductDTO;
import com.huy.ecommerce.dtos.ProductFilterDTO;
import com.huy.ecommerce.dtos.ProductSpecification;
import com.huy.ecommerce.entities.Photo;
import com.huy.ecommerce.entities.Product;
import com.huy.ecommerce.entities.Rating;
import com.huy.ecommerce.exception.ResourceNotFoundException;
import com.huy.ecommerce.repository.CategoryRepository;
import com.huy.ecommerce.repository.PhotoRepository;
import com.huy.ecommerce.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final PhotoRepository photoRepository;
    private final FirebaseStorageService firebaseStorageService;


    @Value("${file.upload-dir}")
    private String uploadDir;

    private PhotoDTO convertToPhotoDTO(Photo photo) {
        PhotoDTO photoDTO = new PhotoDTO();
        photoDTO.setPhotoId(photo.getPhotoId());
        photoDTO.setUrl(photo.getUrl());
        photoDTO.setProductId(photo.getProduct().getProductId());
        return photoDTO;
    }

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
        productDTO.setAverageRating(calculateAverageRating(product.getRatings()));
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
    public Page<ProductDTO> getAllProducts(int page, int size, String category) {
        Pageable pageable = PageRequest.of(page ,size);
        if (category != null) {
            return productRepository.findByCategoryName(category, pageable).map(this::convertToDTO);
        }else {
            return productRepository.findAll(pageable).map(this::convertToDTO);
        }
    }

    // create product
    public void createProduct(ProductDTO productDTO , MultipartFile file) throws IOException{
        String folderPath = "images/products";
        String fileUrl = firebaseStorageService.uploadFile(file, folderPath);

        if (fileUrl == null) {
            throw new IOException("Failed to upload image.");
        }

        String bucketName = firebaseStorageService.getBucketName();
        String encodedFileUrl = URLEncoder.encode(fileUrl, StandardCharsets.UTF_8.toString());
        String fullUrl = String.format("https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media",
                bucketName, encodedFileUrl);
        productDTO.setThumbnailUrl(fullUrl);


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
    }

    // update product
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setStockQuantity(productDTO.getStockQuantity());
        product.setThumbnailUrl(productDTO.getThumbnailUrl());
        product.setCategory(categoryRepository.findById(productDTO.getCategoryId()).orElse(null));
        product.setUpdatedAt(LocalDateTime.now());

        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);

    }

    // DELETE
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    //get product by productId
    public ProductDTO getProductById(Long productId) {
       Product product = productRepository.findById(productId)
               .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
       return convertToDTO(product);
    }

    // search product by keyword
    public Page<ProductDTO> searchProductsByKeyword(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.searchProductsByKeyword(keyword, pageable);
        return products.map(this::convertToDTO);
    }

    public Page<ProductDTO> filterProducts(ProductFilterDTO filterDTO) {
        Pageable pageable = PageRequest.of(filterDTO.getPage(), filterDTO.getSize());
        Specification<Product> spec = ProductSpecification.filterByCriteria(filterDTO);
        Page<Product> products = productRepository.findAll(spec, pageable);
        return products.map(this::convertToDTO);
    }

    private double calculateAverageRating(List<Rating> ratings) {
        return ratings.stream()
                .mapToInt(Rating::getRatingValue)
                .average()
                .orElse(0.0);
    }



}
