package com.lefort.transaction_service.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime; 
import com.lefort.transaction_service.modele.Account; 

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor @ToString 
@Builder 

public class Transaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTransaction;
    private Double amount;
    private LocalDateTime created_at; 
    private LocalDateTime updated_at; 
    private String etat;
    private String typeV;
    
    private Long senderAccountId;
    private Long receiverAccountId; 

    @Transient
    private Account sender;

    @Transient
    private Account receiver;
    
    @PrePersist
    protected void onCreate() {
        this.created_at = LocalDateTime.now();
        this.updated_at = LocalDateTime.now();
        this.etat = "pending";
    } 
}
