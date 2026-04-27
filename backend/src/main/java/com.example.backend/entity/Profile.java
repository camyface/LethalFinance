package com.example.backend.entity;


import jakarta.persistence.*;

@Entity
@Table()
public class Profile {
    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    @JoinColumn(name = "userid")
    private Users users;
    @Column
    private String branchOrAgency;
    @Column
    private String component;
    @Column
    private String grade;
    @Column
    private int yearsOfService;
    @Column
    private int currentAge;
    @Column
    private int targetRetirementAge;
    @Column
    private int annualIncome;
    @Column
    private int monthlyTspContribution;
    @Column
    private int monthlyOtherContribution;
    @Column
    private String maritalStatus;
    @Column
    private int countOfDependents;
    @Column
    private String location;
    @Column
    private String createdAt;
    @Column
    private String updatedAt;

    public Profile() {

    }

    public Users getUser() {
        return users;
    }

    public void setUser(Users users) {
        this.users = users;
    }

    public Profile(Users users, String branchOrAgency, String component, String grade, int yearsOfService, int currentAge, int targetRetirementAge, int annualIncome, int monthlyTspContribution, int monthlyOtherContribution, String maritalStatus, int countOfDependents, String location, String createdAt, String updatedAt) {
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
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
