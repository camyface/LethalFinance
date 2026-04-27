package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("firstName")
    @Column
    private String firstName;
    @JsonProperty("lastName")
    @Column
    private String lastName;
    @Column
    private String email;
    @JsonProperty("password")
    @Column(name = "password_hash")
    private String password;
    @Column
    private String role;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    public Users(String first_name, String last_name, String email, String password_hash) {
        this.firstName = first_name;
        this.lastName = last_name;
        this.email = email;
        this.password = password_hash;
        this.role = "USER";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Users() {

    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

public String getFirstName() {
    return firstName;
}public void setFirstName(String firstName) {
    this.firstName = firstName;
}public String getLastName() {
    return lastName;
}public void setLastName(String lastName) {
    this.lastName = lastName;
}public String getEmail() {
    return email;
}public void setEmail(String email) {
    this.email = email;
}public String getPassword() {
    return password;
}public void setPassword(String password) {
    this.password = password;
}public String getRole() {
    return role;
}public void setRole(String role) {
    this.role = role;
}public LocalDateTime getCreatedAt() {
    return createdAt;
}public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
}public LocalDateTime getUpdatedAt() {
    return updatedAt;
}public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
}}
