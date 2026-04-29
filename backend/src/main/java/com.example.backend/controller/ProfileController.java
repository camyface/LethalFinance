package com.example.backend.controller;

import com.example.backend.entity.Profile;
import com.example.backend.service.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Profile> getProfile(@PathVariable Long userId) {
        return profileService.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Profile> createProfile(@RequestBody ProfileRequest request) {
        Profile saved = profileService.saveProfile(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<Profile> updateProfile(@PathVariable Long userId,
                                                 @RequestBody ProfileRequest request) {
        Profile updated = profileService.updateProfile(userId, request);
        return ResponseEntity.ok(updated);
    }

    // ── Request record ─────────────────────────────────────────

    public record ProfileRequest(
            Long userId,
            String firstName,
            String lastName,
            String dateOfBirth,
            String serviceEntryDate,
            String branchOrAgency,
            String component,
            String grade,
            Integer targetRetirementYear,
            String maritalStatus,
            Integer countOfDependents,
            String location
    ) {}
}