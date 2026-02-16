package com.lefort.transaction_service.consumer;

import com.lefort.transaction_service.entities.TransactionCreatedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
  
import com.lefort.transaction_service.entities.TransactionEvent; 
import org.springframework.kafka.core.KafkaTemplate; 
import org.springframework.beans.factory.annotation.Autowired;
 
import java.util.*; 
import com.lefort.transaction_service.entities.Transaction;
import com.lefort.transaction_service.repositories.TransactionRepository;     
import org.springframework.transaction.annotation.Transactional;  

import java.time.LocalDateTime; 
 
    

@Service 
public class TransactionEventConsumer { 
    
    @Autowired
    private KafkaTemplate<Long, Object> kafkaTemplate;

    
    @Autowired
    private TransactionRepository transactionRepository;
 

    @KafkaListener(topics = "transaction.acc.response", groupId = "transaction-group") 
    public void handleTransaction(TransactionEvent event) {
        System.out.println("=== TRANSACTION EVENT REÇU ===");
        System.out.println(event);
        System.out.println("=============================");

        if (!"SUCCESS".equals(event.getEtat())) {
            System.out.println("Transaction échouée → aucune enregistrement faite a la base de donnee des transactions");
            return;
        }
        
        Transaction newTransaction = new Transaction();
        newTransaction.setSenderAccountId(event.getSenderAccountId());  
        newTransaction.setReceiverAccountId(event.getReceiverAccountId());  
        newTransaction.setAmount(event.getAmount()); 
        newTransaction.setEtat("success"); 
        newTransaction.setTypeV(event.getTypeV()); 

        transactionRepository.save(newTransaction);
 
        System.out.println("✔ Transaction cree avec succès");
        System.out.println("Transaction : " + newTransaction);  
        System.out.println("============================="); 
    }
     
}