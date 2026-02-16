package com.lefort.account_service.consumer;

import com.lefort.account_service.entities.TransactionEvent;
import com.lefort.account_service.entities.UserCreatedEvent;
import com.lefort.account_service.entities.Account;
import com.lefort.account_service.repositories.AccountRepository;
import com.lefort.account_service.service.AccountEventProducer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
    

@Service 
public class AccountEventConsumer {  
    private final AccountRepository accountRepository;
    private final AccountEventProducer accountEventProducer;

    public AccountEventConsumer(AccountRepository accountRepository,
                                AccountEventProducer accountEventProducer) {
        this.accountRepository = accountRepository;
        this.accountEventProducer = accountEventProducer;
    }
 

    @KafkaListener(topics = "transaction.event", groupId = "account-group") 
    public void handleTransaction(TransactionEvent event) {
        System.out.println("=== TRANSACTION EVENT REÇU ===");
        System.out.println(event);
        System.out.println("=============================");

        if (!"SUCCESS".equals(event.getEtat())) {
            System.out.println("Transaction échouée → aucune mise à jour de solde");
            return;
        }

        Account sender = accountRepository
                .findById(event.getSenderAccountId())
                .orElseThrow(() ->
                        new RuntimeException("Compte envoyeur introuvable"));

        Account receiver = accountRepository
                .findById(event.getReceiverAccountId())
                .orElseThrow(() ->
                        new RuntimeException("Compte receveur introuvable"));

        Long amount = event.getAmount();
        String typeV = event.getTypeV(); 

        if ("retrait".equals(typeV)) { 
            sender.setBalance(sender.getBalance() - amount);
            sender.setUpdated_at(LocalDateTime.now());
            accountRepository.save(sender); 
        } else if ("dépôt".equals(typeV)) { 
            sender.setBalance(sender.getBalance() + amount);
            sender.setUpdated_at(LocalDateTime.now());  
            accountRepository.save(sender); 
        } else if ("virement".equals(typeV)) {
            // 🔹 Débit
            sender.setBalance(sender.getBalance() - amount);
            sender.setUpdated_at(LocalDateTime.now());

            // 🔹 Crédit
            receiver.setBalance(receiver.getBalance() + amount);
            receiver.setUpdated_at(LocalDateTime.now());
             
            accountRepository.save(sender);
            accountRepository.save(receiver);
        } else { 
            System.out.println("[ECHEC] Type de virement inconnu");
            return;
        }

        System.out.println("✔ Soldes mis à jour avec succès");
        System.out.println("Sender: " + sender.getBalance());
        System.out.println("Receiver: " + receiver.getBalance());
        System.out.println("============================="); 

        TransactionEvent responseEvent = new TransactionEvent(
                event.getTransactionId(),
                event.getSenderAccountId(),
                event.getReceiverAccountId(),
                event.getAmount(),
                event.getEtat(),
                event.getTypeV()
        );

        accountEventProducer.publishTransactionFromAccount(responseEvent);
    }
    
    @KafkaListener(topics = "user.created", groupId = "account-group") 
    public void handleUserCreated(UserCreatedEvent event) {
        System.out.println("=== USER EVENT REÇU ===");
        System.out.println(event);
        System.out.println("============================="); 

        Account autoNewAccountEpargne = new Account();
        autoNewAccountEpargne.setUserId(event.getUserId());  
        autoNewAccountEpargne.setBalance(100L); 
        autoNewAccountEpargne.setTypeCompte("Epargne"); 
        accountRepository.save(autoNewAccountEpargne);

        Account autoNewAccount = new Account();
        autoNewAccount.setUserId(event.getUserId());  
        autoNewAccount.setBalance(900L);  
        autoNewAccount.setTypeCompte("Courant"); 
        accountRepository.save(autoNewAccount);

        System.out.println("✔ Comptes par défaut creer et assigner avec succès");
        System.out.println("Comptes Courant: " + autoNewAccount); 
        System.out.println("Comptes Epargne: " + autoNewAccountEpargne);
        System.out.println("============================="); 
                 
    }
}