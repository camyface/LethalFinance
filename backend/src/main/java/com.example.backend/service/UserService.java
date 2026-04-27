package com.example.backend.service;


import com.example.backend.entity.Users;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;


@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Users saveUser(Users users) {
        return userRepository.save(users);
    }

    public Users findUserById(Long id) {
        return userRepository.findById(id).orElseThrow();
    }

}
