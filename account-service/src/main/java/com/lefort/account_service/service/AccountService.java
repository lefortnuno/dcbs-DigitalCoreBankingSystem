package com.lefort.account_service.service;

import com.lefort.account_service.entities.Account;
import com.lefort.account_service.repositories.AccountRepository;
import com.lefort.account_service.modele.User; 
import com.lefort.account_service.web.UserOpenFeign; 
import com.lefort.account_service.entities.AccountCreatedEvent;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountEventProducer accountEventProducer;
    private final UserOpenFeign userOpenFeign; 

    public AccountService(AccountRepository accountRepository,
                       AccountEventProducer accountEventProducer,
                       UserOpenFeign userOpenFeign ) {
        this.accountRepository = accountRepository;
        this.accountEventProducer = accountEventProducer;
        this.userOpenFeign = userOpenFeign; 
    }

    // 🔹 GET ALL
    public List<Account> getAllAccounts() {
        List<Account> accounts = accountRepository.findAllByOrderByIdAccountDesc();
        return enrichAccounts(accounts);
    }

    // 🔹 GET BY ID
    public Account getAccountById(Long id) {
        Account account = accountRepository.findById(id).orElseThrow();
        return enrichAccount(account);
    }

    // 🔹 GET MES COMPTES
    public List<Account> getMyAccount(String u1) {
        List<Account> accounts =
                accountRepository.findByUserIdOrderByIdAccountDesc( u1 );
        return enrichAccounts(accounts);
    }
 
    // 🔹 CREATE + Kafka event
    public Account createAccount(Account account) { 
        System.out.println("[CCOUNT-SERVICE] account = " + account);
        User user =
                userOpenFeign.getUserById(account.getUserId());
 
        if (user == null) {
            throw new RuntimeException("Utilisateur introuvable");
        }

        if (account.getBalance() < 0L ) { 
            throw new RuntimeException("Solde négatif !");
        } 
 
        Account savedAccount = accountRepository.save(account);  

        return enrichAccount(savedAccount);
    }

    // 🔹 UPDATE
    public Account updateAccount(Long id, Account account) {
        Account existing = accountRepository.findById(id).orElseThrow();

        existing.setTypeCompte(account.getTypeCompte());
        existing.setBalance(account.getBalance()); 
        existing.setStatus(account.getStatus()); 

        accountRepository.save(existing);

        return enrichAccount(existing);
    }

    // 🔹 DELETE
    public void deleteAccount(Long id) {
        accountRepository.deleteById(id);
    }

    private Account enrichAccount(Account account) {
        if (account.getUserId() != null) {
            User u = userOpenFeign.getUserById(account.getUserId());
            account.setOwner(u);
        } 

        return account;
    }

    private List<Account> enrichAccounts(List<Account> accounts) {
        List<User> users = userOpenFeign.getAllUsers(); 

        for (Account account : accounts) {

            for (User user : users) {
                if (account.getUserId() != null &&
                        account.getUserId().equals(user.getIdUser())) {
                    account.setOwner(user);
                } 
            } 
        }

        return accounts;
    }
}
