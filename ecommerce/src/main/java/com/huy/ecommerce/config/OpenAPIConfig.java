package com.huy.ecommerce.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("E-commerce API")
                        .version("1.0")
                        .description("This is a sample Spring Boot RESTful service using springdoc-openapi and OpenAPI 3."))
                .externalDocs(new io.swagger.v3.oas.models.ExternalDocumentation()
                        .description("Springdoc OpenAPI 3 documentation")
                        .url("https://springdoc.org/"));

    }
}
