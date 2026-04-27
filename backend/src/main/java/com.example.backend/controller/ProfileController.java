package com.example.backend.controller;

import com.example.backend.entity.Profile;
import com.example.backend.service.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/profile")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Profile saveNewProfile(@RequestBody Profile profile) {
        return profileService.saveProfile(profile);
    }
}