package org.com.application;

import org.com.application.service.custom.PaymentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ApplicationTests {

    @Autowired
    PaymentService paymentService;

    @Test
    void contextLoads() {
        try {
            paymentService.delete("");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
