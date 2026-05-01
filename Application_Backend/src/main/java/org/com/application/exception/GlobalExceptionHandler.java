package org.com.application.exception;

import org.com.application.util.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ✅ Custom or generic exceptions (best first layer)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<APIResponse<String>> handleRuntimeException(RuntimeException e) {
        return new ResponseEntity<>(
                new APIResponse<>(
                        HttpStatus.BAD_REQUEST.value(),
                        e.getMessage(),
                        null
                ),
                HttpStatus.BAD_REQUEST
        );
    }
    
    // ✅ Validation errors (IMPORTANT FIXED)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponse<Object>> handleValidation(MethodArgumentNotValidException e) {

        Map<String, String> errors = new HashMap<>();

        e.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });

        return new ResponseEntity<>(
                new APIResponse<>(
                        HttpStatus.BAD_REQUEST.value(),
                        "Validation Failed",
                        errors
                ),
                HttpStatus.BAD_REQUEST
        );
    }

    // ❌ ALWAYS LAST (fallback)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse<String>> handleGenericException(Exception e) {
        return new ResponseEntity<>(
                new APIResponse<>(
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        "Internal Server Error",
                        e.getMessage()
                ),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}