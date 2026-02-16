package com.lefort.transaction_service.service;

import com.lefort.transaction_service.entities.TransactionCreatedEvent;
import com.lefort.transaction_service.entities.TransactionEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service; 


@Service
public class TransactionEventProducer {

    private final KafkaTemplate<Long, Object> kafkaTemplate;

    public TransactionEventProducer(KafkaTemplate<Long, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishTransactionCreated(TransactionCreatedEvent event) { 
        
        System.out.println("=== TRANSACTION EVENT CREER ===");
        System.out.println(event);
        System.out.println("=============================");  
 

        TransactionEvent te = new TransactionEvent(
            event.getTransactionId(), 
            event.getSenderAccountId(),
            event.getReceiverAccountId(),
            event.getAmount(),
            event.getEtat(),
            event.getTypeV()
        );

        te.setEtat("SUCCESS");

        kafkaTemplate.send("transaction.event", te);
        System.out.println("Transaction ID: " + event.getTransactionId() + " crée !"); 
        System.out.println("Transaction: " + event + " !"); 
        System.out.println("============================="); 
    }
}
