// UserService.js

export async function registerUser(userData) {
    const response = await fetch('/api/v1/auth/register', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Registration failed: ${response.status}`);
    }

    return await response.json();
}

export async function loginUser(credentials) {
    const response = await fetch('/api/v1/auth/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // required for session cookie
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Login failed: ${response.status}`);
    }

    return await response.json(); // returns { userId, profileComplete }
}

export async function logoutUser() {
    await fetch('/api/v1/auth/logout', {
        method: "POST",
        credentials: "include",
    });
}

export async function findUserById(id) {
    const response = await fetch(`/api/v1/users/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(`Failed to get user: ${response.status}`);
    }

    return await response.json();
}