import {BelongsTo, BelongsToMany, Column, HasMany, Index, Model, Table} from "sequelize-typescript";
import {IPier} from "../models/pier/types";
import {Robot} from "./robot";

@Table
export class Pier extends Model implements IPier {
    // Primary key
    @Column({primaryKey: true, autoIncrement: true})
    id: number;

    @Column({})
    @Index({
        name: "identifier",
        unique: true
    })
    identifier: string;

    @Column({})
    lastSeenAt: Date;

    @HasMany(() => Robot, 'pierId')
    robots: Robot[];

}