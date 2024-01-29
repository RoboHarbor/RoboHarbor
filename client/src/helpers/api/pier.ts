import { APICore } from './apiCore';

const api = new APICore();

// account
function getAll() {
    const baseUrl = '/api/piers';
    return api.get(`${baseUrl}`);
}

export { getAll};
