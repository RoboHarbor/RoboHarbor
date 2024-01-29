import {Column, DataType, Index, Model, Table} from "sequelize-typescript";
import {IAttribute, IRunnerPackage} from "../models/harbor/types";
import {Sequelize} from "sequelize";

@Table
export class RunnerPackage extends Model implements IRunnerPackage {
    // Primary key
    @Column({primaryKey: true, autoIncrement: true})
    id: number;

    @Index({
        name: "name",
        unique: true
    })
    @Column({})
    name: string;

    @Column({})
    shellCommandForPackageInstallation: string;

    @Column({})
    executionShellCommand: string;

    @Column({
        type: "TEXT",
    })
    logo: string;

    @Column({})
    title: string;

    @Column({})
    parameters: boolean;

    @Column({})
    environmentVariables: boolean;

    @Column({
        type: DataType.JSON
    })
    attributes: IAttribute[];

    @Column({})
    description: string;

    @Column({})
    version: string;

}