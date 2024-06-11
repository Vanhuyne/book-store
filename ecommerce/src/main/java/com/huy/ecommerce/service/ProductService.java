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

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.stream.Collectors;

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
                .map(this::convertToPhotoDTO).collect(Collectors.toList()));
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
                }).collect(Collectors.toList()));
        return product;
    }

    // get all products
    public Page<ProductDTO> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page ,size);
        return productRepository.findAll(pageable).map(this::convertToDTO);
    }

    // create product
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = convertToEntity(productDTO);
        product.setCreatedAt(LocalDateTime.now());
        product.getPhotos().forEach(photo -> photoRepository.save(photo));
        productRepository.save(product);
        return convertToDTO(product);
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
