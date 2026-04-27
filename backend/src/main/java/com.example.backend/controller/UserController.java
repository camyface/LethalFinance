package com.example.backend.controller;


import com.example.backend.entity.Users;
import com.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/test")
    public String test() {
        return "User controller works";
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Users saveNewUser(@RequestBody Users users) {
        return userService.saveUser(users);
    }





}
