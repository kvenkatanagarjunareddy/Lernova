package com.example.coursemanagement.startup;

import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.coursemanagement.entity.Role;
import com.example.coursemanagement.entity.User;
import com.example.coursemanagement.repository.UserRepository;

@Component
public class AdminAccountInitializer implements CommandLineRunner {

    private static final Logger logger =
            LoggerFactory.getLogger(AdminAccountInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email:admin@courseapp.local}")
    private String adminEmail;

    @Value("${admin.password:}")
    private String adminPassword;

    public AdminAccountInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {

        if (adminPassword == null || adminPassword.isBlank()) {
            logger.warn(
                "Admin account was not initialized: configure COURSE_ADMIN_PASSWORD."
            );
            return;
        }

        String normalizedEmail =
                adminEmail.trim().toLowerCase(Locale.ROOT);

        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            logger.info(
                "Admin initialization skipped: an account with email {} already exists.",
                normalizedEmail
            );
            return;
        }

        User admin = new User();
        admin.setName("System Administrator");
        admin.setEmail(normalizedEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ADMIN);

        userRepository.save(admin);

        logger.info(
            "Initial ADMIN account created successfully for {}.",
            normalizedEmail
        );
    }
}