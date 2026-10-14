
package com.example.coursemanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.coursemanagement.entity.Enrollment;

public interface EnrollmentRepository
        extends JpaRepository<Enrollment, Long> {

    // Find all enrollments for a student
    List<Enrollment> findByStudentId(Long studentId);

    // Find all students enrolled in a course
    List<Enrollment> findByCourseId(Long courseId);

    // Find a student's enrollment in a specific course
    Optional<Enrollment> findByStudentIdAndCourseId(
            Long studentId, Long courseId);

    // Check whether a student is already enrolled
    boolean existsByStudentIdAndCourseId(
            Long studentId, Long courseId);

    // Count the number of students enrolled in a course
    long countByCourseId(Long courseId);
}
