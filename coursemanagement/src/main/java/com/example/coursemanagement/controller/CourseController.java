
package com.example.coursemanagement.controller;

import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.coursemanagement.entity.Course;
import com.example.coursemanagement.service.CourseService;
import com.example.coursemanagement.service.EnrollmentService;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;
    private final EnrollmentService enrollmentService;

    public CourseController(
            CourseService courseService,
            EnrollmentService enrollmentService) {
        this.courseService = courseService;
        this.enrollmentService = enrollmentService;
    }

    // 1. Create a course
    @PostMapping
    public ResponseEntity<Course> addCourse(
            @Valid @RequestBody Course course) {

        Course savedCourse = courseService.addCourse(course);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedCourse);
    }

    // 2. Get all courses
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    // 3. Search courses by name
    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(
            @RequestParam String name) {

        return ResponseEntity.ok(
                courseService.searchCoursesByName(name));
    }

    // 4. Filter courses by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Course>> getCoursesByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                courseService.getCoursesByStatus(status));
    }

    // 5. Check course availability
    @GetMapping("/{id}/availability")
    public ResponseEntity<Map<String, Object>> getCourseAvailability(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                enrollmentService.getCourseAvailability(id));
    }

    // 6. Get a course by numeric ID
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<Course> getCourseById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                courseService.getCourseById(id));
    }

    // 7. Update a course
    @PutMapping("/{id:\\d+}")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody Course updatedCourse) {

        Course course =
                courseService.updateCourse(id, updatedCourse);

        return ResponseEntity.ok(course);
    }

    // 8. Delete a course
    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable Long id) {

        courseService.deleteCourse(id);

        return ResponseEntity.noContent().build();
    }
}
