import {ICredentialsInfo} from "../models/robot/types";
import {Column, DataType, Index, Model, Table} from "sequelize-typescript";


@Table
export class Credentials extends Model implements ICredentialsInfo {
    // Primary key
    @Column({primaryKey: true, autoIncrement: true})
    id: number;

    @Column
    username: string;

    @Column
    password: string;

    @Column({type: 'TEXT'})
    sshKey: string;

    @Column
    name: string;

}
