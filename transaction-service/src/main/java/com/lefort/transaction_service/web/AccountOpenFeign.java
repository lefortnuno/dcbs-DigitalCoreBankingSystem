package com.lefort.transaction_service.web;

import com.lefort.transaction_service.modele.Account;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient("ACCOUNT-SERVICE")
public interface AccountOpenFeign {
    @GetMapping("/accounts")
    public List<Account> getAllAccounts();
    @GetMapping("/accounts/{id}")
    public Account getAccountById(@PathVariable("id") Long id);
}
