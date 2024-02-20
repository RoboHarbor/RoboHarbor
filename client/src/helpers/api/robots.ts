import {APICore} from "./apiCore";
import {ICredentialsInfo} from "../../../../src/models/robot/types";

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

export const createCredentials = async (credentials: ICredentialsInfo) => {
    return api.post('/api/robots/credentials', credentials)
        .then((res) => {
            return res.data;
        });
}

export const reloadSourceRobot = async (id: number | undefined) => {
    return api.post('/api/robots/reloadSource/' + id, {});
}

export const updateSourceRobot = async (id: number | undefined) => {
    return api.post('/api/robots/updateSource/' + id, {});
}

export const getCredentials = async () => {
    return api.get('/api/robots/credentials')
        .then((res) => {
            return res.data;
        });
}

export const getRobot = async (id: string) => {
    return api.get('/api/robots/' + id).then((res) => {
        return res.data;
    });
}

export const deleteRobot = async (id: string) => {
    return api.delete('/api/robots/' + id);
}

export const stopRobot = async (id: string) => {
    return api.post('/api/robots/stopRobot/' + id, {});
}

export const runRobot = async (id: string) => {
    return api.post('/api/robots/runRobot/' + id, {});
}