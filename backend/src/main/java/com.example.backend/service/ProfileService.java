package com.example.backend.service;


import com.example.backend.entity.Profile;
import com.example.backend.repository.ProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public Profile saveProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    public Profile findProfileById(Long id) {
        return profileRepository.findById(id).orElseThrow();
    }

}
