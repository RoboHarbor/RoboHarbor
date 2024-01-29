import {APICore} from "./apiCore";

const api = new APICore();


export const createRobotApi = async (bot: any) => {
    return api.post('/api/robots/createRobot', bot);
}

export const updateRobotApi = async (bot: any) => {
    return api.put('/api/robots/'+bot.id, bot);
}

export const runSourceValidationApi = async (bot: any) => {
    return api.post('/api/robots/validateRobot', bot);
}

export const getRobots = async () => {
    return api.get('/api/robots');
}

export const getRobot = async (id: string) => {
    return api.get('/api/robots/' + id).then((res) => {
        return res.data;
    });
}

export const stopRobot = async (id: string) => {
    return api.post('/api/robots/stopRobot/' + id, {});
}

export const runRobot = async (id: string) => {
    return api.post('/api/robots/runRobot/' + id, {});
}