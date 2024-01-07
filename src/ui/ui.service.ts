import { Injectable } from '@nestjs/common';
import {UserData} from "../models/auth/types";

// Development User
let users: UserData[] = [
    {
        id: 1,
        email: 'test',
        username: 'test',
        password: 'test',
        firstName: 'Test',
        lastName: 'User',
        role: 'Admin',
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImlhdCI6MTU4NzM1NjY0OSwiZXhwIjoxOTAyODg5NDQ5LCJhdWQiOiJjb2RlcnRoZW1lcy5jb20iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVzdCIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJIeXBlciJ9.P27f7JNBF-vOaJFpkn-upfEh3zSprYfyhTOYhijykdI',
    },
];

@Injectable()
export class UiService {
    login() {
        return users[0];
    }
}
