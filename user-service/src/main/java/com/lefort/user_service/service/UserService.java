package com.lefort.user_service.service;

import com.lefort.user_service.entities.User;
import com.lefort.user_service.repositories.UserRepository;
import com.lefort.user_service.entities.UserCreatedEvent;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserEventProducer userEventProducer;

    public UserService(UserRepository userRepository,
                       UserEventProducer userEventProducer) {
        this.userRepository = userRepository;
        this.userEventProducer = userEventProducer;
    }
    
    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(String id) {
        return userRepository.findById(id).orElseThrow();
    }
 
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public User createUser(User user) {
        // Sauvegarde DB
        User savedUser = userRepository.save(user);

        // Publication Kafka
        userEventProducer.publishUserCreated(
            new UserCreatedEvent(
                savedUser.getIdUser(),
                savedUser.getUsername(),
                savedUser.getEmail()
            )
        );

        return savedUser;
    }

    public User ensureUser(User user) {
        return userRepository
            .findById(user.getIdUser())
            .orElseGet(() -> {
                User savedUser = userRepository.save(user);
                // Publication Kafka
                userEventProducer.publishUserCreated(
                    new UserCreatedEvent(
                        savedUser.getIdUser(),
                        savedUser.getUsername(),
                        savedUser.getEmail()
                    )
                );
                return savedUser;  
            });
    }
}
