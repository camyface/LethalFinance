package com.example.backend.repository;

import com.example.backend.entity.FinancialGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinancialGoalRepository extends JpaRepository<FinancialGoal, Long> {
    List<FinancialGoal> findByUserId(Long userId);
}