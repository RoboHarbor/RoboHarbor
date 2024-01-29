import { Column, Model, Table } from 'sequelize-typescript';
import {UserData} from "../models/auth/types";

@Table
export class User extends Model implements UserData {
    // Primary key
    @Column({primaryKey: true, autoIncrement: true})
    id: number;
    @Column({allowNull: false, type: 'varchar(255)'})
    email: string;
    @Column
    username: string;
    @Column({allowNull: false, type: 'text'})
    password: string;
    @Column
    firstName: string;
    @Column({allowNull: true, type: 'text'})
    lastName: string;
    @Column
    role: string;
    @Column({allowNull: true, type: 'text'})
    token: string;
}