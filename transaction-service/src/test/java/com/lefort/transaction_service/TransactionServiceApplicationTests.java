package com.lefort.transaction_service;

import com.lefort.transaction_service.entities.Transaction;
import com.lefort.transaction_service.entities.TransactionCreatedEvent;
import com.lefort.transaction_service.modele.Account;
import com.lefort.transaction_service.modele.User;
import com.lefort.transaction_service.repositories.TransactionRepository;
import com.lefort.transaction_service.service.TransactionEventProducer;
import com.lefort.transaction_service.service.TransactionService;
import com.lefort.transaction_service.web.AccountOpenFeign;
import com.lefort.transaction_service.web.UserOpenFeign;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.kafka.core.KafkaTemplate;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceApplicationTests {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private TransactionEventProducer transactionEventProducer;

    @Mock
    private AccountOpenFeign accountOpenFeign;

    @Mock
    private UserOpenFeign userOpenFeign;

    @Mock
    private KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate;

    @InjectMocks
    private TransactionService transactionService;


    @Test
    void contextLoads() {
    }


    private Account buildAccount(Long id, double balance) {
        Account acc = new Account();
        acc.setIdAccount(id);
        acc.setBalance(balance);
        acc.setUserId("1");
        return acc;
    }

    private User buildUser() {
        User u = new User();
        u.setIdUser("1");
        u.setUsername("admin");
        return u;
    }


    @Test
    void getAllTransactions_shouldReturnList() {

        Transaction t = Transaction.builder()
                .idTransaction(1L)
                .senderAccountId(10L)
                .receiverAccountId(20L)
                .amount(100.0)
                .build();

        when(transactionRepository.findAllByOrderByIdTransactionDesc())
                .thenReturn(List.of(t));

        when(accountOpenFeign.getAccountById(anyLong()))
                .thenReturn(buildAccount(10L, 1000));

        when(userOpenFeign.getUserById(anyString()))
                .thenReturn(buildUser());

        List<Transaction> result = transactionService.getAllTransactions();

        assertThat(result).hasSize(1);
        verify(transactionRepository).findAllByOrderByIdTransactionDesc();
    }


    @Test
    void getTransactionById_shouldReturnTransaction() {

        Transaction t = Transaction.builder()
                .idTransaction(1L)
                .senderAccountId(10L)
                .receiverAccountId(20L)
                .amount(100.0)
                .build();

        when(transactionRepository.findById(1L))
                .thenReturn(Optional.of(t));

        when(accountOpenFeign.getAccountById(anyLong()))
                .thenReturn(buildAccount(10L, 1000));

        when(userOpenFeign.getUserById(anyString()))
                .thenReturn(buildUser());

        Transaction result = transactionService.getTransactionById(1L);

        assertThat(result.getIdTransaction()).isEqualTo(1L);
    }


    @Test
    void getMyTransaction_shouldReturnTransactions() {

        Transaction t = Transaction.builder()
                .idTransaction(1L)
                .senderAccountId(10L)
                .receiverAccountId(20L)
                .amount(100.0)
                .build();

        when(transactionRepository
                .findBySenderAccountIdOrReceiverAccountIdOrderByIdTransactionDesc(10L, 10L))
                .thenReturn(List.of(t));

        when(accountOpenFeign.getAccountById(anyLong()))
                .thenReturn(buildAccount(10L, 1000));

        when(userOpenFeign.getUserById(anyString()))
                .thenReturn(buildUser());

        List<Transaction> result = transactionService.getMyTransaction(10L);

        assertThat(result).hasSize(1);
    }


    @Test
    void getAllMyTransactions_shouldReturnTransactions() {

        Transaction t = Transaction.builder()
                .idTransaction(1L)
                .senderAccountId(10L)
                .receiverAccountId(20L)
                .amount(100.0)
                .build();

        when(transactionRepository
                .findBySenderAccountIdInOrReceiverAccountIdInOrderByIdTransactionDesc(
                        List.of(10L),
                        List.of(10L)))
                .thenReturn(List.of(t));

        when(accountOpenFeign.getAccountById(anyLong()))
                .thenReturn(buildAccount(10L, 1000));

        when(userOpenFeign.getUserById(anyString()))
                .thenReturn(buildUser());

        List<Transaction> result =
                transactionService.getAllMyTransactions(List.of(10L));

        assertThat(result).hasSize(1);
    }


    @Test
    void getTransation_shouldReturnConversation() {

        Transaction t = Transaction.builder()
                .idTransaction(1L)
                .senderAccountId(10L)
                .receiverAccountId(20L)
                .amount(100.0)
                .build();

        when(transactionRepository
                .findBySenderAccountIdAndReceiverAccountIdOrSenderAccountIdAndReceiverAccountId(
                        10L, 20L, 20L, 10L))
                .thenReturn(List.of(t));

        when(accountOpenFeign.getAccountById(anyLong()))
                .thenReturn(buildAccount(10L, 1000));

        when(userOpenFeign.getUserById(anyString()))
                .thenReturn(buildUser());

        List<Transaction> result =
                transactionService.getTransation(10L, 20L);

        assertThat(result).hasSize(1);
    }


    @Test
    void createTransaction_shouldSuccess() {

        Transaction t = Transaction.builder()
                .idTransaction(1L)
                .senderAccountId(10L)
                .receiverAccountId(20L)
                .amount(100.0)
                .typeV("virement")
                .build();

        when(accountOpenFeign.getAccountById(10L))
                .thenReturn(buildAccount(10L, 1000));

        when(accountOpenFeign.getAccountById(20L))
                .thenReturn(buildAccount(20L, 1000));

        when(userOpenFeign.getUserById(anyString()))
                .thenReturn(buildUser());

        Transaction result = transactionService.createTransaction(t);

        assertThat(result.getEtat()).isEqualTo("SUCCESS");

        verify(transactionEventProducer)
                .publishTransactionCreated(any(TransactionCreatedEvent.class));
    }


    @Test
    void createTransaction_shouldFail_whenAccountNotFound() {

        Transaction t = Transaction.builder()
                .senderAccountId(10L)
                .receiverAccountId(20L)
                .amount(100.0)
                .typeV("virement")
                .build();

        when(accountOpenFeign.getAccountById(anyLong()))
                .thenReturn(null);

        assertThrows(RuntimeException.class,
                () -> transactionService.createTransaction(t));
    }


    @Test
    void createTransaction_shouldFail_whenBalanceInsufficient() {

        Transaction t = Transaction.builder()
                .senderAccountId(10L)
                .receiverAccountId(20L)
                .amount(5000.0)
                .typeV("virement")
                .build();

        when(accountOpenFeign.getAccountById(10L))
                .thenReturn(buildAccount(10L, 100));

        when(accountOpenFeign.getAccountById(20L))
                .thenReturn(buildAccount(20L, 1000));

        assertThrows(RuntimeException.class,
                () -> transactionService.createTransaction(t));
    }


    @Test
    void updateTransaction_shouldUpdate() {

        Transaction existing = Transaction.builder()
                .idTransaction(1L)
                .amount(100.0)
                .senderAccountId(10L)
                .receiverAccountId(20L)
                .etat("SUCCESS")
                .typeV("virement")
                .build();

        Transaction update = Transaction.builder()
                .amount(200.0)
                .senderAccountId(30L)
                .receiverAccountId(40L)
                .etat("SUCCESS")
                .typeV("retrait")
                .build();

        when(transactionRepository.findById(1L))
                .thenReturn(Optional.of(existing));

        when(transactionRepository.save(existing))
                .thenReturn(existing);

        when(accountOpenFeign.getAccountById(anyLong()))
                .thenReturn(buildAccount(10L, 1000));

        when(userOpenFeign.getUserById(anyString()))
                .thenReturn(buildUser());

        Transaction result =
                transactionService.updateTransaction(1L, update);

        assertThat(result.getAmount()).isEqualTo(200.0);
        assertThat(result.getTypeV()).isEqualTo("retrait");
    }


    @Test
    void deleteTransaction_shouldCallRepository() {

        transactionService.deleteTransaction(1L);

        verify(transactionRepository).deleteById(1L);
    }
}