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

import District from "./District.model";

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

  public getAmphures!: HasManyGetAssociationsMixin<District>;

  public addAmphure!: HasManyAddAssociationMixin<District, number>;

  public static associations: {
    amphures: Association<Province, District>;
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

Province.hasMany(District, {
  sourceKey: "id",
  foreignKey: "provinceId",
  as: "districts",
});

export default Province;
