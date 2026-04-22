package com.example.backend.controller;


import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User saveNewUser(@RequestBody User user) {
        return userService.saveUser(user);
    }



}
