package com.lefort.user_service.entities;
 
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime; 

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor @NoArgsConstructor @Builder

@Table(name = "users")
public class User {
    @Id  
    private String idUser;  
    private String username;
    private String email;
    private LocalDateTime created_at; 
    
    @PrePersist
    protected void onCreate() {
        this.created_at = LocalDateTime.now();
        this.email = username+".dcbs@gmail.com";
    }
}

