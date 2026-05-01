package com.example.backend.controller;

import com.example.backend.entity.FinancialGoal;
import com.example.backend.entity.Users;
import com.example.backend.repository.FinancialGoalRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/goals")
public class FinancialGoalController {

    private final FinancialGoalRepository goalRepository;
    private final UserRepository userRepository;

    public FinancialGoalController(FinancialGoalRepository goalRepository,
                                   UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FinancialGoal>> getGoalsByUser(@PathVariable Long userId) {
        List<FinancialGoal> goals = goalRepository.findByUserId(userId);
        return ResponseEntity.ok(goals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FinancialGoal> getGoalById(@PathVariable Long id) {
        return goalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<FinancialGoal> createGoal(@RequestBody GoalRequest request) {
        Users user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.userId()));

        FinancialGoal goal = new FinancialGoal(
                user,
                request.title(),
                request.description(),
                request.goalType(),
                request.currentAmount(),
                request.targetAmount(),
                request.targetDate() != null ? LocalDate.parse(request.targetDate()) : null,
                request.status()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(goalRepository.save(goal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FinancialGoal> updateGoal(@PathVariable Long id,
                                                    @RequestBody GoalRequest request) {
        FinancialGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found: " + id));

        goal.setTitle(request.title());
        goal.setDescription(request.description());
        goal.setGoalType(request.goalType());
        goal.setCurrentAmount(request.currentAmount());
        goal.setTargetAmount(request.targetAmount());
        goal.setTargetDate(request.targetDate() != null ? LocalDate.parse(request.targetDate()) : null);
        goal.setStatus(request.status());
        goal.setUpdatedAt(LocalDateTime.now());

        return ResponseEntity.ok(goalRepository.save(goal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        goalRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Request record ─────────────────────────────────────────
    public record GoalRequest(
            Long userId,
            String title,
            String description,
            String goalType,
            BigDecimal currentAmount,
            BigDecimal targetAmount,
            String targetDate,
            String status
    ) {}
}