package com.lefort.user_service.web;

import com.lefort.user_service.entities.User;
import com.lefort.user_service.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> findAll() {
        return userService.findAll();
    }

    @GetMapping("/users/{id}")
    public User findById(@PathVariable("id") String id) {
        return userService.findById(id);
    }

    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PostMapping("/users/ensure")
    public User ensureUser(@RequestBody User user) {
        
        System.out.println(" USER CONTROLLER : " + user);
        return userService.ensureUser(user);
    }
}
