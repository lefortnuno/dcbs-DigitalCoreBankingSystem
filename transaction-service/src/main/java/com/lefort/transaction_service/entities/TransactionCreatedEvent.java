package com.lefort.transaction_service.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionCreatedEvent {
    private Long transactionId;
    private Long senderAccountId;
    private Long receiverAccountId;
    private Double amount;
    private String etat;
    private String typeV;
}
