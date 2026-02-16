package com.lefort.transaction_service;

import com.lefort.transaction_service.entities.Transaction;
import com.lefort.transaction_service.repositories.TransactionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean; 

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class TransactionServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TransactionServiceApplication.class, args);
	}
    
    @Bean
    CommandLineRunner run(TransactionRepository transactionRepository) {
        return args -> {
            // 
        };
    }

}
