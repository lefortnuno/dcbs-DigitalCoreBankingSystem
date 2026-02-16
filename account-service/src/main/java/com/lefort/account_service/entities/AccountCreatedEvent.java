package com.lefort.account_service.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountCreatedEvent {
    private Long accountId;
    private String userId; 
    private String typeCompte;
    private Long balance; 
}
