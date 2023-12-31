import {
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import sequelize from "@/database/sequelize";
import Amphure from "./Amphure.model";

class Tambon extends Model<
  InferAttributes<Tambon>,
  InferCreationAttributes<Tambon>
> {
  declare id: CreationOptional<number>;

  declare zipCode: number;

  declare nameThai: string;
  declare nameEng: string;

  declare amphureId: number;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;

  declare getAmphure: BelongsToGetAssociationMixin<Amphure>;
}

Tambon.init(
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
    amphureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "amphure", key: "id" },
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
    tableName: "tambon",
    sequelize,
  }
);

export default Tambon;
