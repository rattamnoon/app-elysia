import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import sequelize from "@/database/sequelize";
import Province from "./Province.model";
import SubDistrict from "./SubDistrict.model";

class District extends Model<
  InferAttributes<District>,
  InferCreationAttributes<District>
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

  declare getSubDistricts: HasManyGetAssociationsMixin<SubDistrict>;

  declare addSubDistrict: HasManyAddAssociationMixin<SubDistrict, number>;

  public static associations: {
    province: Association<District, Province>;
    subDistricts: Association<District, SubDistrict>;
  };
}

District.init(
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
    tableName: "district",
    sequelize,
  }
);

District.hasMany(SubDistrict, {
  sourceKey: "id",
  foreignKey: "districtId",
  as: "subDistricts",
});

export default District;
