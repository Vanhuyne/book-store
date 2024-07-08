package com.huy.ecommerce.service;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String from;

    @Async
    public void sendWelcomeEmail(String to, String firstName) {
        try{
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);

            mimeMessageHelper.setFrom(from);
            mimeMessageHelper.setTo(to);
            mimeMessageHelper.setSubject("Welcome to our platform!");

            // create the thymeleaf context and add variables
            Context context = new Context();
            context.setVariable("firstName", firstName);

            // Process the template
            String htmlContent = templateEngine.process("welcome", context);

            mimeMessageHelper.setText(htmlContent, true);

            javaMailSender.send(mimeMessage);

        }catch (MessagingException e){
            e.printStackTrace();
        }
    }

    @Async
    public void sendPasswordResetEmail(String to, String token) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);

            mimeMessageHelper.setFrom(from);
            mimeMessageHelper.setTo(to);
            mimeMessageHelper.setSubject("Password Reset Request");

            // Create the Thymeleaf context and add variables
            Context context = new Context();
            context.setVariable("resetUrl", "http://localhost:4200/reset-password?token=" + token);

            // Process the template
            String htmlContent = templateEngine.process("password-reset", context);

            mimeMessageHelper.setText(htmlContent, true);

            javaMailSender.send(mimeMessage);

        } catch (MessagingException e) {
            e.printStackTrace();
            throw new MailSendException("Error sending password reset email to " + to);
        }
    }
}
