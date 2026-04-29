// ProfileService.js

export async function saveProfile(profile) {
    const response = await fetch('/api/v1/profile', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profile),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Failed to save profile: ${response.status}`);
    }

    return await response.json();
}

export async function updateProfile(userId, profile) {
    const response = await fetch(`/api/v1/profile/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profile),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Failed to update profile: ${response.status}`);
    }

    return await response.json();
}

export async function findProfileByUserId(userId) {
    const response = await fetch(`/api/v1/profile/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (response.status === 404) {
        return null; // profile does not exist yet
    }

    if (!response.ok) {
        throw new Error(`Failed to get profile: ${response.status}`);
    }

    return await response.json();
}