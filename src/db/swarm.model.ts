import {BelongsTo, BelongsToMany, Column, HasMany, Index, Model, NotNull, Table} from "sequelize-typescript";
import {IPier} from "../models/pier/types";
import {BotType, IRobot, ISourceInfo} from "../models/robot/types";
import {Pier} from "./pier.model";
import {Sequelize} from "sequelize";
import {ISwarm} from "../../client/src/models/swarm/ISwarm";
import {Robot} from "./robot";

@Table
export class SwarmModel extends Model implements ISwarm {
    // Primary key
    @Column({primaryKey: true, autoIncrement: true})
    id: number;

    @Column({})
    name: string;


    @Column({})
    enabled: boolean;

    @HasMany(() => Robot, 'swarmID')
    robots: IRobot[];

}