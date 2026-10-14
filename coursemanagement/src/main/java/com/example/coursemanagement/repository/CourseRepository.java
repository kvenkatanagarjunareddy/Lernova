
package com.example.coursemanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.coursemanagement.entity.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByCourseNameContainingIgnoreCase(String name);

    List<Course> findByStatusIgnoreCase(String status);
}
