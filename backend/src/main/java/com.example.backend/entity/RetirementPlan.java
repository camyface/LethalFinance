package com.example.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.Period;

@Entity
@Table(name = "retirement_plan")
public class RetirementPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column
    private String title;

    @Column
    private String description;

    @Column(name = "current_rank")
    private String currentRank;

    @Column(name = "target_retirement_year")
    private Integer targetRetirementYear;

    @Column(name = "retirement_type")
    private String retirementType;

    @Column(name = "tsp_contribution_percent", precision = 5, scale = 2)
    private BigDecimal tspContributionPercent;

    @Column(name = "expected_annual_raise_percent", precision = 5, scale = 2)
    private BigDecimal expectedAnnualRaisePercent;

    @Column(name = "monthly_other_contribution", precision = 12, scale = 2)
    private BigDecimal monthlyOtherContribution;

    @Column(name = "retirement_income_goal", precision = 12, scale = 2)
    private BigDecimal retirementIncomeGoal;

    @Column(name = "assumed_return_rate", precision = 5, scale = 2)
    private BigDecimal assumedReturnRate;

    @Column
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public RetirementPlan() {}

    public RetirementPlan(Users user, String title, String description, String currentRank,
                          Integer targetRetirementYear, String retirementType,
                          BigDecimal tspContributionPercent, BigDecimal expectedAnnualRaisePercent,
                          BigDecimal monthlyOtherContribution, BigDecimal retirementIncomeGoal,
                          BigDecimal assumedReturnRate, String notes) {
        this.user = user;
        this.title = title;
        this.description = description;
        this.currentRank = currentRank;
        this.targetRetirementYear = targetRetirementYear;
        this.retirementType = retirementType;
        this.tspContributionPercent = tspContributionPercent;
        this.expectedAnnualRaisePercent = expectedAnnualRaisePercent;
        this.monthlyOtherContribution = monthlyOtherContribution;
        this.retirementIncomeGoal = retirementIncomeGoal;
        this.assumedReturnRate = assumedReturnRate;
        this.notes = notes;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // ── Calculated at runtime — never stored ──────────────────

    /**
     * Monthly TSP contribution derived from base pay and contribution percent.
     * Base pay is looked up from the user's profile grade at runtime.
     */
    public BigDecimal getMonthlyTspContribution(BigDecimal basePay) {
        if (basePay == null || tspContributionPercent == null) return BigDecimal.ZERO;
        return basePay.multiply(tspContributionPercent.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP))
                .setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Age at retirement derived from user's date of birth and target retirement year.
     */
    public int getAgeAtRetirement(java.time.LocalDate dateOfBirth) {
        if (dateOfBirth == null || targetRetirementYear == null) return 0;
        return targetRetirementYear - dateOfBirth.getYear();
    }

    /**
     * Years of service at retirement derived from service entry date and target retirement year.
     */
    public int getYearsOfServiceAtRetirement(java.time.LocalDate serviceEntryDate) {
        if (serviceEntryDate == null || targetRetirementYear == null) return 0;
        return targetRetirementYear - serviceEntryDate.getYear();
    }

    /**
     * BRS pension multiplier — 2.0% per year of service.
     */
    public BigDecimal getPensionMultiplier(java.time.LocalDate serviceEntryDate) {
        int yos = getYearsOfServiceAtRetirement(serviceEntryDate);
        return BigDecimal.valueOf(yos).multiply(BigDecimal.valueOf(0.02));
    }

    /**
     * Estimated monthly pension — High-3 average × pension multiplier.
     * High-3 is passed in from the BRS calculator service.
     */
    public BigDecimal getEstimatedMonthlyPension(BigDecimal highThreeAverage,
                                                 java.time.LocalDate serviceEntryDate) {
        if (highThreeAverage == null) return BigDecimal.ZERO;
        return highThreeAverage
                .multiply(getPensionMultiplier(serviceEntryDate))
                .divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
    }

    /**
     * Estimated annual pension.
     */
    public BigDecimal getEstimatedAnnualPension(BigDecimal highThreeAverage,
                                                java.time.LocalDate serviceEntryDate) {
        return getEstimatedMonthlyPension(highThreeAverage, serviceEntryDate)
                .multiply(BigDecimal.valueOf(12));
    }

    // ── Getters & Setters ─────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Users getUser() { return user; }
    public void setUser(Users user) { this.user = user; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCurrentRank() { return currentRank; }
    public void setCurrentRank(String currentRank) { this.currentRank = currentRank; }

    public Integer getTargetRetirementYear() { return targetRetirementYear; }
    public void setTargetRetirementYear(Integer targetRetirementYear) { this.targetRetirementYear = targetRetirementYear; }

    public String getRetirementType() { return retirementType; }
    public void setRetirementType(String retirementType) { this.retirementType = retirementType; }

    public BigDecimal getTspContributionPercent() { return tspContributionPercent; }
    public void setTspContributionPercent(BigDecimal tspContributionPercent) { this.tspContributionPercent = tspContributionPercent; }

    public BigDecimal getExpectedAnnualRaisePercent() { return expectedAnnualRaisePercent; }
    public void setExpectedAnnualRaisePercent(BigDecimal expectedAnnualRaisePercent) { this.expectedAnnualRaisePercent = expectedAnnualRaisePercent; }

    public BigDecimal getMonthlyOtherContribution() { return monthlyOtherContribution; }
    public void setMonthlyOtherContribution(BigDecimal monthlyOtherContribution) { this.monthlyOtherContribution = monthlyOtherContribution; }

    public BigDecimal getRetirementIncomeGoal() { return retirementIncomeGoal; }
    public void setRetirementIncomeGoal(BigDecimal retirementIncomeGoal) { this.retirementIncomeGoal = retirementIncomeGoal; }

    public BigDecimal getAssumedReturnRate() { return assumedReturnRate; }
    public void setAssumedReturnRate(BigDecimal assumedReturnRate) { this.assumedReturnRate = assumedReturnRate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}