import { APICore } from './apiCore';

const api = new APICore();

// account
function login(params: { email: string; password: string }) {
    const baseUrl = '/api/ui/login/';
    return api.create(`${baseUrl}`, params);
}

function logout() {
    const baseUrl = '/api/ui/logout/';
    return api.create(`${baseUrl}`, {});
}

function signup(params: { fullname: string; email: string; password: string }) {
    const baseUrl = '/api/ui/register/';
    return api.create(`${baseUrl}`, params);
}

function forgotPassword(params: { email: string }) {
    const baseUrl = '/api/ui/forget-password/';
    return api.create(`${baseUrl}`, params);
}

export { login, logout, signup, forgotPassword };
