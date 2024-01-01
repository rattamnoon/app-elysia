import {
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import sequelize from "@/database/sequelize";
import Amphure from "./District.model";

class SubDistrict extends Model<
  InferAttributes<SubDistrict>,
  InferCreationAttributes<SubDistrict>
> {
  declare id: CreationOptional<number>;

  declare zipCode: number;

  declare nameThai: string;
  declare nameEng: string;

  declare districtId: number;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;

  declare getAmphure: BelongsToGetAssociationMixin<Amphure>;
}

SubDistrict.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    zipCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nameThai: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameEng: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    districtId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "district", key: "id" },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "subDistrict",
    sequelize,
  }
);

export default SubDistrict;
