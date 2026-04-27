export async function saveProfile(profile) {
    const response = await fetch('/api/v1/profile', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            },
        body: JSON.stringify(profile),
    });

    if(!response.ok) {
        throw new Error(`Failed to save profile: ${response.status}`)
    }

    return await response.json();
}