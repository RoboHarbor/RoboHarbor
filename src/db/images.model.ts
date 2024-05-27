import {Column, DataType, Index, Model, Table} from "sequelize-typescript";
import {Sequelize} from "sequelize";
import {IAttribute, IImagesModel} from "../models/harbor/types";

@Table
export class Images extends Model implements IImagesModel {
    // Primary key
    @Column({primaryKey: true, autoIncrement: true})
    id: number;

    @Index({
        name: "image_name",
        unique: true
    })
    @Column({})
    name: string;

    @Column({})
    title: string;

    @Column({})
    imageContainerName: string;

    @Column({})
    logo: string;

    @Column({
        type: DataType.JSON
    })
    attributes: IAttribute[];

    @Column({})
    description: string;

    @Column({})
    version: string;
}