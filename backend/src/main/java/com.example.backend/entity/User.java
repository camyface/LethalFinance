package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class User {
    @Id
    @GeneratedValue
    private Long id;

    @Column
    private String firstName;
    @Column
    private String lastName;
    @Column
    private String email;
    @Column
    private String password;
    @Column
    private String role;
    @Column
    private String createdAt;
    @Column
    private String updatedAt;


    public User(String first_name, String last_name, String email, String password_hash, String role) {
        this.firstName = first_name;
        this.lastName = last_name;
        this.email = email;
        this.password = password_hash;
        this.role = role;
    }

    public User() {

    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }


}
