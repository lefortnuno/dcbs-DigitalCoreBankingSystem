package com.lefort.account_service.service;

import com.lefort.account_service.entities.AccountCreatedEvent;
import com.lefort.account_service.entities.TransactionEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service; 


@Service
public class AccountEventProducer {

    private final KafkaTemplate<Long, Object> kafkaTemplate;

    public AccountEventProducer(KafkaTemplate<Long, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishTransactionFromAccount(TransactionEvent event) { 
        System.out.println("=== TRANSACTION EVENT PUBLIER BY ACCOUNT===");
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

        kafkaTemplate.send("transaction.acc.response", te);
        System.out.println("[ACCOUNT EVENT] Transaction ID: " + event.getTransactionId() + " crée !"); 
        System.out.println("[ACCOUNT EVENT] Transaction: " + event + " !"); 
        System.out.println("============================="); 
    }
}
