package com.lefort.account_service.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime; 
import com.lefort.account_service.modele.User; 

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor @ToString 
@Builder 

public class Account {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAccount;
    private String typeCompte;
    private Double balance; 
    private LocalDateTime created_at; 
    private LocalDateTime updated_at; 
    private Boolean status;
    
    private String userId;
    @Transient
    private User owner;
    
    @PrePersist
    protected void onCreate() {
        this.created_at = LocalDateTime.now();
        this.updated_at = LocalDateTime.now();
        this.status = true;  
    } 
}
