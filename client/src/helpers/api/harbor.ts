import {APICore} from "./apiCore";

const api = new APICore();

export const getRunnerPackages = async () => {
    return api.get('/api/harbor/availableRunnerPackages');
}
