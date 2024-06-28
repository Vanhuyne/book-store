package com.huy.ecommerce;

import com.huy.ecommerce.entities.Category;
import com.huy.ecommerce.entities.Product;
import com.huy.ecommerce.repository.CategoryRepository;
import com.huy.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Random;

@SpringBootApplication
public class EcommerceApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(EcommerceApplication.class, args);
	}

//	@Autowired
//	private ProductRepository productRepository;
//	@Autowired
//	private CategoryRepository categoryRepository;

	@Override
	public void run(String... args) throws Exception {
		loadProducts();
	}


	private void loadProducts() {
//		Random random = new Random();
//
//		for (int i = 1; i < 20; i++) {
//			long categoryId = 1 + random.nextInt(5);
//			Category category = categoryRepository.findById(categoryId).orElse(null);
//
//			if (category != null) {
//				Product product = new Product();
//				product.setName("Product " + i);
//				product.setDescription("Description for Product " + i);
//				product.setPrice(10.0 * i);
//				product.setStockQuantity(100 - i);
//				product.setThumbnailUrl("http://example.com/product" + i + ".jpg");
//				product.setCategory(category);
//				product.setCreatedAt(LocalDateTime.now());
//				product.setUpdatedAt(LocalDateTime.now());
//				product.setCartItems(new HashSet<>());
//				product.setPhotos(new ArrayList<>());
//				productRepository.save(product);
//			} else {
//				System.out.println("Category with ID " + categoryId + " not found");
//			}
//
//		}
	}
}
