import { Platform } from 'react-native';

const DEFAULT_BASE_URL_IOS = 'http://127.0.0.1:8080';
const DEFAULT_BASE_URL_ANDROID = 'http://10.0.2.2:8080';

const getBaseUrl = () => {
    const override = process.env.EXPO_PUBLIC_API_URL;
    if (override && override.trim()) {
        return override.replace(/\/$/, '');
    }
    
    // For Vercel production deployment
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        if (process.env.NODE_ENV === 'production' || !__DEV__) {
            return '/api';
        }
    }

    return Platform.OS === 'android' ? DEFAULT_BASE_URL_ANDROID : DEFAULT_BASE_URL_IOS;
};

async function request(path, options = {}) {
    const response = await fetch(`${getBaseUrl()}/shifts${path}`, {
        headers: {
            Accept: 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        throw new Error((data && data.message) || `Request failed with status ${response.status}`);
    }

    return data;
}

export function fetchShifts() {
    return request('');
}

export function bookShift(id) {
    return request(`/${id}/book`, { method: 'POST' });
}

export function cancelShift(id) {
    return request(`/${id}/cancel`, { method: 'POST' });
}