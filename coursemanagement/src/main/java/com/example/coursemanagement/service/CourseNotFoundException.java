
package com.example.coursemanagement.service;

@SuppressWarnings("serial")
public class CourseNotFoundException extends RuntimeException {

    public CourseNotFoundException(String message) {
        super(message);
    }
}
