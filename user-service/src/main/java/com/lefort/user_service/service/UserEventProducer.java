package com.lefort.user_service.service;

import com.lefort.user_service.entities.UserCreatedEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserEventProducer {

    private final KafkaTemplate<String, UserCreatedEvent> kafkaTemplate;

    public UserEventProducer(KafkaTemplate<String, UserCreatedEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishUserCreated(UserCreatedEvent event) {
        System.out.println("=== CREATION USER EVENT REÇU ===");
        System.out.println(event);
        System.out.println("============================="); 
        kafkaTemplate.send("user.created", event.getUserId(), event);
    }
}
