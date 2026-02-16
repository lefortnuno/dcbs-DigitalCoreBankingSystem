package com.lefort.transaction_service.modele;
 
import lombok.*; 
import jakarta.persistence.*; 
import java.time.LocalDateTime; 

// @Table(name = "users")
@Setter @Getter @ToString @NoArgsConstructor @AllArgsConstructor
@Builder
public class User {
    private String idUser;
    private String username; 
    private String email; 
    private LocalDateTime created_at; 
}
