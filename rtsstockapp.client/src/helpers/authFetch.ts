import { LoginResponse } from "../api/LoginResponse";

export function setLocalStorage(response: LoginResponse) {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('expires', response.expiresIn.toString());
}

export function deleteLocalStorage() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expires');
}

export async function authFetch(url: string, options: RequestInit = {}) {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const expires = localStorage.getItem('expires');

    if (!accessToken || !refreshToken || !expires) {
        throw new Error('No access or refresh token available');
    }

    const isTokenExpired = () => {
        const expiresIn = parseInt(expires);
        return expiresIn * 1000 < Date.now();
    };

    const refreshAccessToken = async () => {
        const response = await fetch('/api/v1/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refreshToken: refreshToken
            }),
        });

        if (!response.ok) {
            deleteLocalStorage();
            window.location.href = '/login';
            throw new Error('Failed to refresh access token');
        }

        const data = await response.json() as LoginResponse;
        setLocalStorage(data);
        return data.accessToken;
    };

    let token = accessToken;

    if (isTokenExpired()) {
        token = await refreshAccessToken();
    }

    const authOptions = {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
        },
    };

    const result = await fetch(url, authOptions);
    if (result.status === 401) {
        deleteLocalStorage();
        throw new Error('Unauthorized');
    }
    return result;
};