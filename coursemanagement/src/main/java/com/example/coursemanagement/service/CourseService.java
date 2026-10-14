package com.example.coursemanagement.service;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.coursemanagement.entity.Course;
import com.example.coursemanagement.repository.CourseRepository;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Course addCourse(Course course) {
        return courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() ->
                    new CourseNotFoundException(
                        "Course not found with ID: " + id
                    )
                );
    }

    @Transactional
    public Course updateCourse(Long id, Course updatedCourse) {

        Course existingCourse = getCourseById(id);

        existingCourse.setCourseName(updatedCourse.getCourseName());
        existingCourse.setDescription(updatedCourse.getDescription());
        existingCourse.setDurationWeeks(updatedCourse.getDurationWeeks());
        existingCourse.setFee(updatedCourse.getFee());
        existingCourse.setStatus(updatedCourse.getStatus());
        existingCourse.setCapacity(updatedCourse.getCapacity());

        return courseRepository.save(existingCourse);
    }

    @Transactional
    public void deleteCourse(Long id) {

        Course existingCourse = getCourseById(id);

        try {

            courseRepository.delete(existingCourse);

            // Force DELETE SQL to execute here so that
            // DataIntegrityViolationException can be caught
            courseRepository.flush();

        } catch (DataIntegrityViolationException e) {

            throw new IllegalStateException(
                "Cannot delete this course because students are already enrolled in it."
            );
        }
    }

    public List<Course> searchCoursesByName(String name) {

        if (name == null || name.isBlank()) {
            return List.of();
        }

        return courseRepository
                .findByCourseNameContainingIgnoreCase(name.trim());
    }

    public List<Course> getCoursesByStatus(String status) {

        if (status == null || status.isBlank()) {
            return List.of();
        }

        return courseRepository.findByStatusIgnoreCase(status.trim());
    }
}