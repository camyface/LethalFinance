package com.example.backend.service;

import com.example.backend.controller.ProfileController.ProfileRequest;
import com.example.backend.entity.Profile;
import com.example.backend.entity.Users;
import com.example.backend.repository.ProfileRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public Optional<Profile> findByUserId(Long userId) {
        return profileRepository.findByUsersId(userId);
    }

    public Profile saveProfile(ProfileRequest request) {
        Users user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.userId()));

        Profile profile = new Profile();
        profile.setUsers(user);
        mapRequestToProfile(request, profile);
        profile.setCreatedAt(LocalDateTime.now());
        profile.setUpdatedAt(LocalDateTime.now());

        return profileRepository.save(profile);
    }

    public Profile updateProfile(Long userId, ProfileRequest request) {
        Profile profile = profileRepository.findByUsersId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for user: " + userId));

        mapRequestToProfile(request, profile);
        profile.setUpdatedAt(LocalDateTime.now());

        return profileRepository.save(profile);
    }

    // ── Private helpers ────────────────────────────────────────

    private void mapRequestToProfile(ProfileRequest request, Profile profile) {
        profile.setFirstName(request.firstName());
        profile.setLastName(request.lastName());
        profile.setDateOfBirth(LocalDate.parse(request.dateOfBirth()));
        profile.setBasicActiveServiceDate(LocalDate.parse(request.serviceEntryDate()));
        profile.setBranchOrAgency(request.branchOrAgency());
        profile.setComponent(request.component());
        profile.setGrade(request.grade());
        profile.setTargetRetirementYear(request.targetRetirementYear());
        profile.setMaritalStatus(request.maritalStatus());
        profile.setCountOfDependents(request.countOfDependents());
        profile.setLocation(request.location());
    }
}