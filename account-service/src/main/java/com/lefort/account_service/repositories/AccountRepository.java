package com.lefort.account_service.repositories;

import com.lefort.account_service.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface AccountRepository  extends JpaRepository<Account, Long> {  
    List<Account> findByUserIdOrderByIdAccountDesc(String userId );
    List<Account> findAllByOrderByIdAccountDesc();
}
