package com.lefort.account_service.web;

import com.lefort.account_service.modele.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient("USER-SERVICE")
public interface UserOpenFeign {
    @GetMapping("/users")
    public List<User> getAllUsers();
    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable("id") String id);
}
