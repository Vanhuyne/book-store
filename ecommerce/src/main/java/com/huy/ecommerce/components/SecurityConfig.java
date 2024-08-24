package com.huy.ecommerce.components;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationProvider authenticationProvider;
    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http.cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeRequests(req ->
                        req
                                .requestMatchers(HttpMethod.GET , "/api/products/**").permitAll()
                                .requestMatchers(HttpMethod.POST , "/api/products/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll()
                                .requestMatchers(  "/api/ratings/**").permitAll()

                                .requestMatchers(HttpMethod.POST ,"/api/orders/place-order").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                                .requestMatchers(HttpMethod.POST, "/api/orders/create-payment-intent").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                                .requestMatchers( "/api/orders/**").hasAnyAuthority("ROLE_ADMIN")

                                .requestMatchers(HttpMethod.GET, "/api/payments/**").hasAnyAuthority("ROLE_ADMIN")

                                .requestMatchers(  "/api/cart/**").permitAll()

                                .requestMatchers("/api/auth/**").permitAll()
                                .requestMatchers("/oauth2/**").permitAll()
                                .anyRequest().authenticated()
                )
                .sessionManagement(sessionManagement ->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore( jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

}
