import {Column, DataType, Index, Model, Table} from "sequelize-typescript";
import {ILog} from "../../client/src/models/log/types";

@Table
export class Log extends Model implements ILog {
    // Primary key
    @Column({primaryKey: true, autoIncrement: true})
    id: number;

    @Column
    date: Date;

    @Column
    level: string;

    @Column({type: DataType.TEXT})
    logs: string;

    @Column({allowNull: false})
    @Index("log_robotId_index")
    robotId: number;

}