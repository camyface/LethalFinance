// GoalService.js
// API service for financial goals — connects to Spring Boot backend

export async function getAllGoals(userId) {
    const response = await fetch(`/api/v1/goals/user/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response.ok) throw new Error(`Failed to fetch goals: ${response.status}`);
    return await response.json();
}

export async function createGoal(goal) {
    const response = await fetch('/api/v1/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(goal),
    });
    if (!response.ok) throw new Error(`Failed to create goal: ${response.status}`);
    return await response.json();
}

export async function updateGoal(id, goal) {
    const response = await fetch(`/api/v1/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(goal),
    });
    if (!response.ok) throw new Error(`Failed to update goal: ${response.status}`);
    return await response.json();
}

export async function deleteGoal(id) {
    const response = await fetch(`/api/v1/goals/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) throw new Error(`Failed to delete goal: ${response.status}`);
}