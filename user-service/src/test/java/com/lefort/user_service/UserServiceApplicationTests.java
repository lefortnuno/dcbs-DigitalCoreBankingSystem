package com.lefort.user_service;
import com.lefort.user_service.repositories.UserRepository;
import com.lefort.user_service.service.UserEventProducer;
import com.lefort.user_service.service.UserService;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.lefort.user_service.entities.User;
import com.lefort.user_service.repositories.UserRepository;
import com.lefort.user_service.entities.UserCreatedEvent; 
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime; 

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
 
@ExtendWith(MockitoExtension.class)
class UserServiceApplicationTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserEventProducer userEventProducer;

    @InjectMocks
    private UserService userService;


	@Test
	void contextLoads() {
	}

    @Test
    void findAll_shouldReturnUsers() {
        // GIVEN
        User user = new User("1", "admin", "admin.dcds@gmail.com", LocalDateTime.now());
        when(userRepository.findAll()).thenReturn(List.of(user));

        // WHEN
        List<User> result = userService.findAll();

        // THEN
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getUsername()).isEqualTo("admin");
        verify(userRepository).findAll();
    }

    @Test
    void findById_shouldReturnUser() {
        // GIVEN
        User user = new User("1", "admin", "admin.dcds@gmail.com", LocalDateTime.now());
        when(userRepository.findById("1")).thenReturn(Optional.of(user));

        // WHEN
        User result = userService.findById("1");

        // THEN
        assertThat(result.getUsername()).isEqualTo("admin");
        verify(userRepository).findById("1");
    }

    @Test
    void createUser_shouldSaveUser_andPublishEvent() {
        // GIVEN
        User user = new User("1", "admin", "admin.dcds@gmail.com", LocalDateTime.now());
        when(userRepository.save(user)).thenReturn(user);

        // WHEN
        User result = userService.createUser(user);

        // THEN
        assertThat(result).isNotNull();
        verify(userRepository).save(user);

        verify(userEventProducer).publishUserCreated(
            argThat(event ->
                event.getUserId().equals("1") &&
                event.getUsername().equals("admin") &&
                event.getEmail().equals("admin.dcds@gmail.com") 
            )
        );
    }

    @Test
    void ensureUser_shouldReturnExistingUser() {
        // GIVEN
        User user = new User("1", "admin", "admin.dcds@gmail.com", LocalDateTime.now());
        when(userRepository.findById("1")).thenReturn(Optional.of(user));

        // WHEN
        User result = userService.ensureUser(user);

        // THEN
        assertThat(result).isEqualTo(user);
        verify(userRepository, never()).save(any());
    }

    @Test
    void ensureUser_shouldSaveUserIfNotExists() {
        // GIVEN
        User user = new User("1", "admin", "admin.dcds@gmail.com", LocalDateTime.now());
        when(userRepository.findById("1")).thenReturn(Optional.empty());
        when(userRepository.save(user)).thenReturn(user);

        // WHEN
        User result = userService.ensureUser(user);

        // THEN
        assertThat(result).isEqualTo(user);
        verify(userRepository).save(user);
    }
}
