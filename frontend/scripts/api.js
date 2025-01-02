const API_BASE_URL = "http://localhost:8000/api"; // Replace with your backend URL

const api = {
    login: async (username, password) => {
        const response = await fetch(`${API_BASE_URL}/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
        return response.json();
    },

    register: async (username, password, avatar) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("avatar", avatar);

        const response = await fetch(`${API_BASE_URL}/register/`, {
            method: "POST",
            body: formData,
        });
        return response.json();
    },

    joinTournament: async (playerName) => {
        const response = await fetch(`${API_BASE_URL}/tournament/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ playerName }),
        });
        return response.json();
    },
};
