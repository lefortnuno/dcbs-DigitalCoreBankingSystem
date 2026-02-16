package com.lefort.user_service.repositories;

import com.lefort.user_service.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository  extends JpaRepository<User, String> {
}
