package com.example.backend.entity;


import com.fasterxml.jackson.annotation.JsonProperty;import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "profile")
public class Profile {
    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    @JoinColumn(name = "userid")
    private Users users;
    @Column
    @JsonProperty("branch_or_agency")
    private String branchOrAgency;
    @Column
    private String component;
    @Column
    private String grade;
    @Column
    @JsonProperty("years_of_service")
    private double yearsOfService;
    @Column
    @JsonProperty("current_age")
    private double currentAge;
    @Column
    @JsonProperty("target_retirement_age")
    private double targetRetirementAge;
    @Column
    @JsonProperty("annual_income")
    private double annualIncome;
    @Column
    @JsonProperty("monthly_tsp_contribution")
    private double monthlyTspContribution;
    @Column
    @JsonProperty("monthly_other_contribution")
    private double monthlyOtherContribution;
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

    public Profile(Users users, String branchOrAgency, String component, String grade, double yearsOfService, double currentAge, double targetRetirementAge, double annualIncome, double monthlyTspContribution, double monthlyOtherContribution, String maritalStatus, int countOfDependents, String location, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.users = users;
        this.branchOrAgency = branchOrAgency;
        this.component = component;
        this.grade = grade;
        this.yearsOfService = yearsOfService;
        this.currentAge = currentAge;
        this.targetRetirementAge = targetRetirementAge;
        this.annualIncome = annualIncome;
        this.monthlyTspContribution = monthlyTspContribution;
        this.monthlyOtherContribution = monthlyOtherContribution;
        this.maritalStatus = maritalStatus;
        this.countOfDependents = countOfDependents;
        this.location = location;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
    return id;
}public void setId(Long id) {
    this.id = id;
}public Users getUsers() {
    return users;
}public void setUsers(Users users) {
    this.users = users;
}public String getBranchOrAgency() {
    return branchOrAgency;
}public void setBranchOrAgency(String branchOrAgency) {
    this.branchOrAgency = branchOrAgency;
}public String getComponent() {
    return component;
}public void setComponent(String component) {
    this.component = component;
}public String getGrade() {
    return grade;
}public void setGrade(String grade) {
    this.grade = grade;
}public double getYearsOfService() {
    return yearsOfService;
}public void setYearsOfService(int yearsOfService) {
    this.yearsOfService = yearsOfService;
}public double getCurrentAge() {
    return currentAge;
}public void setCurrentAge(int currentAge) {
    this.currentAge = currentAge;
}public double getTargetRetirementAge() {
    return targetRetirementAge;
}public void setTargetRetirementAge(int targetRetirementAge) {
    this.targetRetirementAge = targetRetirementAge;
}public double getAnnualIncome() {
    return annualIncome;
}public void setAnnualIncome(int annualIncome) {
    this.annualIncome = annualIncome;
}public double getMonthlyTspContribution() {
    return monthlyTspContribution;
}public void setMonthlyTspContribution(int monthlyTspContribution) {
    this.monthlyTspContribution = monthlyTspContribution;
}public double getMonthlyOtherContribution() {
    return monthlyOtherContribution;
}public void setMonthlyOtherContribution(int monthlyOtherContribution) {
    this.monthlyOtherContribution = monthlyOtherContribution;
}public String getMaritalStatus() {
    return maritalStatus;
}public void setMaritalStatus(String maritalStatus) {
    this.maritalStatus = maritalStatus;
}public int getCountOfDependents() {
    return countOfDependents;
}public void setCountOfDependents(int countOfDependents) {
    this.countOfDependents = countOfDependents;
}public String getLocation() {
    return location;
}public void setLocation(String location) {
    this.location = location;
}public LocalDateTime getCreatedAt() {
    return createdAt;
}public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
}public LocalDateTime getUpdatedAt() {
    return updatedAt;
}public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
}}
