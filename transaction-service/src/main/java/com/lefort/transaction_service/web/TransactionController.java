package com.lefort.transaction_service.web;

import com.lefort.transaction_service.entities.Transaction;
import com.lefort.transaction_service.service.TransactionService; 
import org.springframework.web.bind.annotation.*; 
import java.util.*;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService; 

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService; 
    }  

    // ======================== GET ALL ========================
    @GetMapping
    public List<Transaction> findAll() {
        return transactionService.getAllTransactions();
    }

    // ======================== GET BY ID ========================
    @GetMapping("/{id}")
    public Transaction findById(@PathVariable("id") Long id) {
        return transactionService.getTransactionById(id);
    }
    
    // ======================== ALL MY TRANSACTION ========================
    @GetMapping("/AllMyTrans")
    public List<Transaction> findAllMyTransaction(
            @RequestParam("ids") List<Long> aId
    ) {
        return transactionService.getAllMyTransactions(aId);
    }
    
    @GetMapping("/AllMyTransToDelete")
    public List<Transaction> findAllMyTransactionToDelete(
            @RequestParam("ids") List<Long> aId
    ) {
        return transactionService.getAllMyTransactionsToDelete(aId);
    }

    // ======================== MY TRANSACTION ========================
    @GetMapping("/MyTrans")
    public List<Transaction> findMyTransaction(
            @RequestParam("u1") Long aId
    ) {
        return transactionService.getMyTransaction(aId);
    }

    // ======================== CONVERSATION ========================
    @GetMapping("/trans")
    public List<Transaction> findTransaction(
            @RequestParam("u1") Long u1,
            @RequestParam("u2") Long u2
    ) {
        return transactionService.getTransation(u1, u2);
    }

    // ======================== SAVE ========================
    @PostMapping
    public Transaction save(@RequestBody Transaction transaction) {
        return transactionService.createTransaction(transaction);
    }

    // ======================== UPDATE ========================
    @PutMapping("/{id}")
    public Transaction update(@PathVariable("id") Long id, @RequestBody Transaction transaction) {
        return transactionService.updateTransaction(id, transaction);
    }

    // ======================== DELETE ========================
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable("id") Long id) {
        transactionService.deleteTransaction(id);
    }
}
