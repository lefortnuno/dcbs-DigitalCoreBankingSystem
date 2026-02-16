package com.lefort.transaction_service.repositories;

import com.lefort.transaction_service.entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface TransactionRepository  extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllByOrderByIdTransactionDesc();
 
    List<Transaction> findBySenderAccountIdOrReceiverAccountIdOrderByIdTransactionDesc(Long senderId, Long receiverId);
    
    List<Transaction> findBySenderAccountIdInOrReceiverAccountIdInOrderByIdTransactionDesc(
        List<Long> senderIds,
        List<Long> receiverIds
);

    List<Transaction> findBySenderAccountIdAndReceiverAccountId(Long senderId, Long receiverId);

    List<Transaction> findBySenderAccountIdAndReceiverAccountIdOrSenderAccountIdAndReceiverAccountId(
            Long senderId1, Long receiverId1,
            Long senderId2, Long receiverId2
    );
}
