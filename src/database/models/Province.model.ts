import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import sequelize from "@/database/sequelize";

import Amphure from "./Amphure.model";

class Province extends Model<
  InferAttributes<Province>,
  InferCreationAttributes<Province>
> {
  declare id: CreationOptional<number>;

  declare nameThai: string;
  declare nameEng: string;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;

  public getAmphures!: HasManyGetAssociationsMixin<Amphure>;

  public addAmphure!: HasManyAddAssociationMixin<Amphure, number>;

  // public amphures: Amphure[];

  public static associations: {
    amphures: Association<Province, Amphure>;
  };
}

Province.init(
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
    tableName: "province",
    sequelize,
  }
);

Province.hasMany(Amphure, {
  sourceKey: "id",
  foreignKey: "provinceId",
  as: "amphures",
});

export default Province;
