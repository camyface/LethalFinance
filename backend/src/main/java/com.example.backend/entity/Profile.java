package com.example.backend.entity;


import com.fasterxml.jackson.annotation.JsonProperty;import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;


@Entity
@Table(name = "profile")
public class Profile {

    /*Profile entity has a 1-1 relationship with users as each user should have one profile that belongs
    to them. The profile table should also include information about the user that is not unique to a
    specific retirement plan, financial goal, or budget AND IS NOT AUTHENTICATION INFORMATION.

    This entity
    includes functions to calculate current age and years of service during runtime.
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private Users users;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "basic_active_service_date")
    private LocalDate basicActiveServiceDate;

    @Column
    @JsonProperty("branch_or_agency")
    private String branchOrAgency;

    @Column
    private String component;

    @Column
    private String grade;

    @Column
    @JsonProperty("target_retirement_year")
    private double targetRetirementYear;

    @Column
    @JsonProperty("marital_status")
    private String maritalStatus;

    @Column
    @JsonProperty("count_of_dependents")
    private int countOfDependents;

    @Column
    private String location;

    @Column
    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @Column
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    public Profile() {

    }

    public Users getUser() {
        return users;
    }

    public void setUser(Users users) {
        this.users = users;
    }

    //Full args constructor

    public Profile(Users users, String firstName, String lastName, LocalDate dateOfBirth, LocalDate basicActiveServiceDate, String branchOrAgency, String component, String grade, double targetRetirementAge, String maritalStatus, int countOfDependents, String location, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.users = users;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.basicActiveServiceDate = basicActiveServiceDate;
        this.branchOrAgency = branchOrAgency;
        this.component = component;
        this.grade = grade;
        this.targetRetirementAge = targetRetirementAge;
        this.maritalStatus = maritalStatus;
        this.countOfDependents = countOfDependents;
        this.location = location;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    //Runtime Calculation Functions

    public int getCurrentAge() {
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }

    public int getYearsOfService() {
        return Period.between(basicActiveServiceDate, LocalDate.now()).getYears();
    }


    //Getters and Setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public LocalDate getBasicActiveServiceDate() {
        return basicActiveServiceDate;
    }

    public void setBasicActiveServiceDate(LocalDate basicActiveServiceDate) {
        this.basicActiveServiceDate = basicActiveServiceDate;
    }

    public String getBranchOrAgency() {
        return branchOrAgency;
    }

    public void setBranchOrAgency(String branchOrAgency) {
        this.branchOrAgency = branchOrAgency;
    }

    public String getComponent() {
        return component;
    }

    public void setComponent(String component) {
        this.component = component;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public double getTargetRetirementYear() {
        return targetRetirementYear;
    }

    public void setTargetRetirementYear(double targetRetirementYear) {
        this.targetRetirementYear = targetRetirementYear;
    }

    public String getMaritalStatus() {
        return maritalStatus;
    }

    public void setMaritalStatus(String maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public int getCountOfDependents() {
        return countOfDependents;
    }

    public void setCountOfDependents(int countOfDependents) {
        this.countOfDependents = countOfDependents;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}