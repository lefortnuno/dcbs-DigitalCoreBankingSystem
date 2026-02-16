package com.lefort.transaction_service.modele;
 
import lombok.*; 
import jakarta.persistence.*; 
 
@Setter @Getter @ToString @NoArgsConstructor @AllArgsConstructor
@Builder
public class Account {
    private Long idAccount; 
    private String typeCompte;
    private Double balance;  
    private Boolean status;
    private String userId;
    private String username;
}
