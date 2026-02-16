package com.lefort.account_service.web;

import com.lefort.account_service.entities.Account;
import com.lefort.account_service.service.AccountService; 
import org.springframework.web.bind.annotation.*; 
import java.util.*;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    private final AccountService accountService; 

    public AccountController(AccountService accountService) {
        this.accountService = accountService; 
    }  

    // ======================== GET ALL ========================
    @GetMapping
    public List<Account> findAll() {
        return accountService.getAllAccounts();
    }

    // ======================== GET BY ID ========================
    @GetMapping("/{id}")
    public Account findById(@PathVariable("id") Long id) {
        return accountService.getAccountById(id);
    }

    // ======================== MES COMPTES ========================
    @GetMapping("/myAccount")
    public List<Account> findMyAccount(
            @RequestParam("u1") String u1 
    ) {
        return accountService.getMyAccount(u1);
    }

    // ======================== SAVE ========================
    @PostMapping
    public Account save(@RequestBody Account account) {
        return accountService.createAccount(account);
    }

    // ======================== UPDATE ========================
    @PutMapping("/{id}")
    public Account update(@PathVariable("id") Long id, @RequestBody Account account) {
        return accountService.updateAccount(id, account);
    }

    // ======================== DELETE ========================
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable("id") Long id) {
        accountService.deleteAccount(id);
    }
}
