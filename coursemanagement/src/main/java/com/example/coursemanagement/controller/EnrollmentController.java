
package com.example.coursemanagement.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.coursemanagement.entity.Course;
import com.example.coursemanagement.entity.Enrollment;
import com.example.coursemanagement.entity.User;
import com.example.coursemanagement.repository.UserRepository;
import com.example.coursemanagement.service.EnrollmentService;

import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final UserRepository userRepository;

    public EnrollmentController(
            EnrollmentService enrollmentService,
            UserRepository userRepository) {
        this.enrollmentService = enrollmentService;
        this.userRepository = userRepository;
    }

    // 1. Enroll the authenticated student in a course
    @PostMapping("/courses/{courseId}")
    public ResponseEntity<?> enroll(
            @PathVariable @Positive Long courseId,
            Authentication authentication) {

        User student = getAuthenticatedUser(authentication);

        Enrollment enrollment = enrollmentService.enrollStudent(
                student.getId(), courseId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Enrollment successful");
        response.put("enrollmentId", enrollment.getId());
        response.put("studentName", student.getName());
        response.put("courseId", enrollment.getCourse().getId());
        response.put("courseName",
                enrollment.getCourse().getCourseName());
        response.put("fee", enrollment.getCourse().getFee());
        response.put("enrollmentDate", enrollment.getEnrollmentDate());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 2. Get the authenticated student's enrollment history
    @GetMapping("/my")
    public ResponseEntity<?> getMyEnrollments(
            Authentication authentication) {

        User student = getAuthenticatedUser(authentication);

        List<Enrollment> enrollments =
                enrollmentService.getStudentEnrollments(student.getId());

        List<Map<String, Object>> result = enrollments.stream()
                .map(enrollment -> {
                    Course course = enrollment.getCourse();

                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("enrollmentId", enrollment.getId());
                    item.put("studentName", student.getName());
                    item.put("courseId", course.getId());
                    item.put("courseName", course.getCourseName());
                    item.put("fee", course.getFee());
                    item.put("enrollmentDate",
                            enrollment.getEnrollmentDate());

                    return item;
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    // 3. Get all enrollments (ADMIN only through SecurityConfig)
    @GetMapping("/all")
    public ResponseEntity<?> getAllEnrollments() {

        List<Enrollment> enrollments =
                enrollmentService.getAllEnrollments();

        List<Map<String, Object>> result = enrollments.stream()
                .map(enrollment -> {
                    User student = enrollment.getStudent();
                    Course course = enrollment.getCourse();

                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("enrollmentId", enrollment.getId());
                    item.put("studentId", student.getId());
                    item.put("studentName", student.getName());
                    item.put("studentEmail", student.getEmail());
                    item.put("courseId", course.getId());
                    item.put("courseName", course.getCourseName());
                    item.put("fee", course.getFee());
                    item.put("enrollmentDate",
                            enrollment.getEnrollmentDate());

                    return item;
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    // 4. Cancel the authenticated student's own enrollment
    @DeleteMapping("/{enrollmentId}")
    public ResponseEntity<Void> cancelEnrollment(
            @PathVariable @Positive Long enrollmentId,
            Authentication authentication) {

        User student = getAuthenticatedUser(authentication);

        enrollmentService.cancelEnrollment(
                student.getId(), enrollmentId);

        return ResponseEntity.noContent().build();
    }

    // Find the user from the email stored in the JWT authentication
    private User getAuthenticatedUser(Authentication authentication) {

        if (authentication == null || authentication.getName() == null) {
            throw new IllegalStateException(
                    "Authentication is required");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Authenticated user not found"));
    }
}
