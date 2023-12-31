import {
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import sequelize from "@/database/sequelize";
import Province from "./Province.model";
import Tambon from "./Tambon.model";

class Amphure extends Model<
  InferAttributes<Amphure>,
  InferCreationAttributes<Amphure>
> {
  declare id: CreationOptional<number>;

  declare nameThai: string;
  declare nameEng: string;

  declare provinceId: number;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;

  declare getProvince: BelongsToGetAssociationMixin<Province>;
  declare getTambons: HasManyGetAssociationsMixin<Tambon>;
}

Amphure.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nameThai: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameEng: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provinceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "province", key: "id" },
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
    tableName: "amphure",
    sequelize,
  }
);

export default Amphure;
