package com.lefort.account_service;

import com.lefort.account_service.entities.Account;
import com.lefort.account_service.modele.User;
import com.lefort.account_service.repositories.AccountRepository;
import com.lefort.account_service.service.AccountEventProducer;
import com.lefort.account_service.service.AccountService;
import com.lefort.account_service.web.UserOpenFeign;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceApplicationTests {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private AccountEventProducer accountEventProducer;

    @Mock
    private UserOpenFeign userOpenFeign;

    @InjectMocks
    private AccountService accountService;


    @Test
    void contextLoads() {
    }

    @Test
    void getAllAccounts_shouldReturnAccounts() {

        Account account = Account.builder()
                .idAccount(1L)
                .typeCompte("COURANT")
                .balance(1000.0)
                .userId("1")
                .status(true)
                .build();

        User user = new User("1", "admin", "admin@gmail.com", LocalDateTime.now());

        when(accountRepository.findAllByOrderByIdAccountDesc())
                .thenReturn(List.of(account));

        when(userOpenFeign.getAllUsers())
                .thenReturn(List.of(user));

        List<Account> result = accountService.getAllAccounts();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getOwner()).isNotNull();

        verify(accountRepository).findAllByOrderByIdAccountDesc();
    }

    @Test
    void getAccountById_shouldReturnAccount() {

        Account account = Account.builder()
                .idAccount(1L)
                .typeCompte("COURANT")
                .balance(1000.0)
                .userId("1")
                .build();

        User user = new User("1", "admin", "admin@gmail.com", LocalDateTime.now());

        when(accountRepository.findById(1L))
                .thenReturn(Optional.of(account));

        when(userOpenFeign.getUserById("1"))
                .thenReturn(user);

        Account result = accountService.getAccountById(1L);

        assertThat(result.getIdAccount()).isEqualTo(1L);
        assertThat(result.getOwner()).isNotNull();

        verify(accountRepository).findById(1L);
    }

    @Test
    void createAccount_shouldSaveAccount() {

        Account account = Account.builder()
                .idAccount(1L)
                .typeCompte("COURANT")
                .balance(500.0)
                .userId("1")
                .build();

        User user = new User("1", "admin", "admin@gmail.com", LocalDateTime.now());

        when(userOpenFeign.getUserById("1")).thenReturn(user);
        when(accountRepository.save(account)).thenReturn(account);

        Account result = accountService.createAccount(account);

        assertThat(result).isNotNull();
        assertThat(result.getOwner()).isNotNull();

        verify(accountRepository).save(account);
    }

    @Test
    void createAccount_shouldThrowException_whenUserNotFound() {

        Account account = Account.builder()
                .typeCompte("COURANT")
                .balance(500.0)
                .userId("1")
                .build();

        when(userOpenFeign.getUserById("1")).thenReturn(null);

        assertThrows(RuntimeException.class,
                () -> accountService.createAccount(account));

        verify(accountRepository, never()).save(any());
    }

    @Test
    void createAccount_shouldThrowException_whenNegativeBalance() {

        Account account = Account.builder()
                .typeCompte("COURANT")
                .balance(-100.0)
                .userId("1")
                .build();

        User user = new User("1", "admin", "admin@gmail.com", LocalDateTime.now());

        when(userOpenFeign.getUserById("1")).thenReturn(user);

        assertThrows(RuntimeException.class,
                () -> accountService.createAccount(account));

        verify(accountRepository, never()).save(any());
    }

    @Test
    void updateAccount_shouldUpdateFields() {

        Account existing = Account.builder()
                .idAccount(1L)
                .typeCompte("COURANT")
                .balance(100.0)
                .status(true)
                .userId("1")
                .build();

        Account update = Account.builder()
                .typeCompte("EPARGNE")
                .balance(200.0)
                .status(false)
                .build();

        when(accountRepository.findById(1L))
                .thenReturn(Optional.of(existing));

        when(accountRepository.save(existing))
                .thenReturn(existing);

        when(userOpenFeign.getUserById("1"))
                .thenReturn(new User("1", "admin", "admin@gmail.com", LocalDateTime.now()));

        Account result = accountService.updateAccount(1L, update);

        assertThat(result.getTypeCompte()).isEqualTo("EPARGNE");
        assertThat(result.getBalance()).isEqualTo(200.0);
        assertThat(result.getStatus()).isFalse();

        verify(accountRepository).save(existing);
    }

    @Test
    void deleteAccount_shouldCallRepository() {

        accountService.deleteAccount(1L);

        verify(accountRepository).deleteById(1L);
    }

    @Test
    void getMyAccount_shouldReturnAccountsForUser() {

        Account account = Account.builder()
                .idAccount(1L)
                .typeCompte("COURANT")
                .balance(1000.0)
                .userId("1")
                .build();

        User user = new User("1", "admin", "admin@gmail.com", LocalDateTime.now());

        when(accountRepository.findByUserIdOrderByIdAccountDesc("1"))
                .thenReturn(List.of(account));

        when(userOpenFeign.getAllUsers())
                .thenReturn(List.of(user));

        List<Account> result = accountService.getMyAccount("1");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getOwner()).isNotNull();

        verify(accountRepository).findByUserIdOrderByIdAccountDesc("1");
    }
}