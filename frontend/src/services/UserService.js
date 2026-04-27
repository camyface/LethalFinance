export async function saveUser(users) {
    const response = await fetch('/api/v1/users', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(users),
    });

    if (!response.ok) {
        throw new Error(`Failed to save user: ${response.status}`)
    }

    return await response.json();
}