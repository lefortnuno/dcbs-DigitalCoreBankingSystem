package com.lefort.transaction_service.service;

import com.lefort.transaction_service.entities.Transaction;
import com.lefort.transaction_service.repositories.TransactionRepository;
import com.lefort.transaction_service.modele.Account;
import com.lefort.transaction_service.modele.User;
import com.lefort.transaction_service.web.AccountOpenFeign;
import com.lefort.transaction_service.web.UserOpenFeign;
import com.lefort.transaction_service.entities.TransactionCreatedEvent;
import org.springframework.stereotype.Service;
import org.springframework.kafka.core.KafkaTemplate;

import java.util.List;

@Service
public class TransactionService {

    private final KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate;
    private final TransactionRepository transactionRepository;
    private final TransactionEventProducer transactionEventProducer;
    private final AccountOpenFeign accountOpenFeign;
    private final UserOpenFeign userOpenFeign;

    public TransactionService(
            TransactionRepository transactionRepository,
            TransactionEventProducer transactionEventProducer,
            AccountOpenFeign accountOpenFeign,
            UserOpenFeign userOpenFeign,
            KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate
    ) {
        this.transactionRepository = transactionRepository;
        this.transactionEventProducer = transactionEventProducer;
        this.accountOpenFeign = accountOpenFeign;
        this.userOpenFeign = userOpenFeign;
        this.kafkaTemplate = kafkaTemplate;
    }

    // ======================== GET ALL ========================
    public List<Transaction> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAllByOrderByIdTransactionDesc();
        return enrichTransactions(transactions);
    }

    // ======================== GET BY ID ========================
    public Transaction getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id).orElseThrow();
        return enrichTransaction(transaction);
    }
    
    // ======================== GET BY ARRAY ID ========================
    public List<Transaction> getAllMyTransactions(List<Long> myAccountIds) {

        List<Transaction> transactions =
                transactionRepository
                        .findBySenderAccountIdInOrReceiverAccountIdInOrderByIdTransactionDesc(
                                myAccountIds,
                                myAccountIds
                        );

    return enrichTransactions(transactions);
    
    }

    public List<Transaction> getAllMyTransactionsToDelete(List<Long> myAccountIds) {
        List<Transaction> transactions =
                transactionRepository
                        .findBySenderAccountIdInOrReceiverAccountIdInOrderByIdTransactionDesc(
                                myAccountIds,
                                myAccountIds
                        );

        List<Transaction> listeTransactionAsupp = enrichTransactions(transactions); 
        transactionRepository.deleteAll(listeTransactionAsupp);
        
        List<Transaction> remaining =
                transactionRepository
                        .findBySenderAccountIdInOrReceiverAccountIdInOrderByIdTransactionDesc(
                                myAccountIds,
                                myAccountIds
                        );

        if (remaining.isEmpty()) {
            return List.of();  
        }

        return enrichTransactions(remaining); 
    }



    // ======================== GET BY ID ========================
    public List<Transaction> getMyTransaction(Long id) {
        List<Transaction> transactions =
                transactionRepository.findBySenderAccountIdOrReceiverAccountIdOrderByIdTransactionDesc(id, id);

        return enrichTransactions(transactions);
    }

 
    // ======================== GET CONVERSATION ========================
    public List<Transaction> getTransation(Long u1, Long u2) {
        List<Transaction> transactions =
                transactionRepository
                        .findBySenderAccountIdAndReceiverAccountIdOrSenderAccountIdAndReceiverAccountId(
                                u1, u2, u2, u1
                        );

        return enrichTransactions(transactions);
    }

    // ======================== CREATE ========================
    public Transaction createTransaction(Transaction transaction) { 
        System.out.println("[TRANS-SERVICE] transaction = " + transaction);
        Account senderAccount =
                accountOpenFeign.getAccountById(transaction.getSenderAccountId());

        Account receiverAccount =
                accountOpenFeign.getAccountById(transaction.getReceiverAccountId());

        if (senderAccount == null || receiverAccount == null) {
            throw new RuntimeException("Compte envoyeur ou receveur introuvable");
        }

        if (senderAccount.getBalance() < transaction.getAmount() && "virement".equals(transaction.getTypeV()) ) {
            transaction.setEtat("FAILED");
            throw new RuntimeException("Solde insuffisant");
        }
        
        if (senderAccount.getBalance() < transaction.getAmount() && "retrait".equals(transaction.getTypeV())) {
            transaction.setEtat("FAILED");
            throw new RuntimeException("Solde insuffisant");
        }

        transaction.setEtat("SUCCESS");

        // Transaction savedTransaction = transactionRepository.save(transaction);

        Transaction savedTransaction = new Transaction();
        savedTransaction.setIdTransaction(transaction.getIdTransaction());
        savedTransaction.setSenderAccountId(transaction.getSenderAccountId());
        savedTransaction.setReceiverAccountId(transaction.getReceiverAccountId());
        savedTransaction.setAmount(transaction.getAmount());
        savedTransaction.setEtat(transaction.getEtat());
        savedTransaction.setTypeV(transaction.getTypeV());

        transactionEventProducer.publishTransactionCreated(
                new TransactionCreatedEvent(
                        savedTransaction.getIdTransaction(),
                        savedTransaction.getSenderAccountId(),
                        savedTransaction.getReceiverAccountId(),
                        savedTransaction.getAmount(),
                        savedTransaction.getEtat(),
                        savedTransaction.getTypeV()
                )
        );

        return enrichTransaction(savedTransaction);
    }

    // ======================== UPDATE ========================
    public Transaction updateTransaction(Long id, Transaction transaction) {
        Transaction existing = transactionRepository.findById(id).orElseThrow();

        existing.setAmount(transaction.getAmount());
        existing.setSenderAccountId(transaction.getSenderAccountId());
        existing.setReceiverAccountId(transaction.getReceiverAccountId());
        existing.setEtat(transaction.getEtat());
        existing.setTypeV(transaction.getTypeV());

        transactionRepository.save(existing);

        return enrichTransaction(existing);
    }

    // ======================== DELETE ========================
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    // ==========================================================
    // ======================== ENRICH ==========================
    // ==========================================================

    private Transaction enrichTransaction(Transaction transaction) {

        if (transaction.getSenderAccountId() != null) {
            Account sender =
                    accountOpenFeign.getAccountById(transaction.getSenderAccountId());

            enrichAccountWithUser(sender);
            transaction.setSender(sender);
        }

        if (transaction.getReceiverAccountId() != null) {
            Account receiver =
                    accountOpenFeign.getAccountById(transaction.getReceiverAccountId());

            enrichAccountWithUser(receiver);
            transaction.setReceiver(receiver);
        }

        return transaction;
    }

    private List<Transaction> enrichTransactions(List<Transaction> transactions) {

        for (Transaction transaction : transactions) {
            enrichTransaction(transaction);
        }

        return transactions;
    }

    private void enrichAccountWithUser(Account account) {

        if (account == null || account.getUserId() == null)
            return;

        try {
            User user = userOpenFeign.getUserById(account.getUserId());

            if (user != null) {
                account.setUsername(user.getUsername());
            }

        } catch (Exception e) {
            System.out.println("Erreur récupération user : " + e.getMessage());
        }
    }
}