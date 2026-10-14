
package com.example.coursemanagement.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.coursemanagement.entity.Role;
import com.example.coursemanagement.repository.CourseRepository;
import com.example.coursemanagement.repository.EnrollmentRepository;
import com.example.coursemanagement.repository.UserRepository;

@Service
public class DashboardService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public DashboardService(
            CourseRepository courseRepository,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStatistics() {

        long totalCourses = courseRepository.count();

        long totalStudents = userRepository.countByRole(Role.STUDENT);

        long totalEnrollments = enrollmentRepository.count();

        long totalCapacity = courseRepository.findAll()
                .stream()
                .filter(course ->
                        "ACTIVE".equalsIgnoreCase(course.getStatus()))
                .mapToLong(course -> course.getCapacity())
                .sum();

        long activeEnrollments = enrollmentRepository.findAll()
                .stream()
                .filter(enrollment ->
                        "ACTIVE".equalsIgnoreCase(
                                enrollment.getCourse().getStatus()))
                .count();

        long availableSeats = Math.max(
                0L, totalCapacity - activeEnrollments);

        Map<String, Object> statistics = new LinkedHashMap<>();
        statistics.put("totalCourses", totalCourses);
        statistics.put("totalStudents", totalStudents);
        statistics.put("totalEnrollments", totalEnrollments);
        statistics.put("availableSeats", availableSeats);

        return statistics;
    }
}
