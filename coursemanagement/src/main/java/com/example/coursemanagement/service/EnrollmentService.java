
package com.example.coursemanagement.service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.coursemanagement.entity.Course;
import com.example.coursemanagement.entity.Enrollment;
import com.example.coursemanagement.entity.Role;
import com.example.coursemanagement.entity.User;
import com.example.coursemanagement.repository.CourseRepository;
import com.example.coursemanagement.repository.EnrollmentRepository;
import com.example.coursemanagement.repository.UserRepository;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            CourseRepository courseRepository,
            UserRepository userRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    // Enroll a student in an active course
    @Transactional
    public Enrollment enrollStudent(Long studentId, Long courseId) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() ->
                    new IllegalArgumentException("Student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new IllegalArgumentException(
                    "Only students can enroll in courses");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                    new IllegalArgumentException("Course not found"));

        if (!"ACTIVE".equalsIgnoreCase(course.getStatus())) {
            throw new IllegalArgumentException(
                    "Cannot enroll in an inactive course");
        }

        if (enrollmentRepository.existsByStudentIdAndCourseId(
                studentId, courseId)) {
            throw new IllegalArgumentException(
                    "Student is already enrolled in this course");
        }

        // Check course capacity
        long enrolledCount =
                enrollmentRepository.countByCourseId(courseId);

        if (enrolledCount >= course.getCapacity()) {
            throw new IllegalArgumentException(
                    "This course has reached its maximum capacity");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(LocalDateTime.now());

        return enrollmentRepository.save(enrollment);
    }

    // Get all enrollments belonging to a student
    @Transactional(readOnly = true)
    public List<Enrollment> getStudentEnrollments(Long studentId) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() ->
                    new IllegalArgumentException("Student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new IllegalArgumentException(
                    "This account is not a student account");
        }

        return enrollmentRepository.findByStudentId(studentId);
    }

    // Get every enrollment (admin use)
    @Transactional(readOnly = true)
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    // Cancel a student's own enrollment
    @Transactional
    public void cancelEnrollment(Long studentId, Long enrollmentId) {

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() ->
                    new IllegalArgumentException("Enrollment not found"));

        if (!enrollment.getStudent().getId().equals(studentId)) {
            throw new IllegalArgumentException(
                    "You can cancel only your own enrollment");
        }

        enrollmentRepository.delete(enrollment);
    }

    // Get course capacity and remaining seats
    @Transactional(readOnly = true)
    public Map<String, Object> getCourseAvailability(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                    new IllegalArgumentException("Course not found"));

        long enrolledStudents =
                enrollmentRepository.countByCourseId(courseId);

        long availableSeats = Math.max(
                0L, course.getCapacity() - enrolledStudents);

        Map<String, Object> result = new LinkedHashMap<>();

        result.put("courseId", course.getId());
        result.put("courseName", course.getCourseName());
        result.put("capacity", course.getCapacity());
        result.put("enrolledStudents", enrolledStudents);
        result.put("availableSeats", availableSeats);
        result.put("status", course.getStatus());

        return result;
    }
}
