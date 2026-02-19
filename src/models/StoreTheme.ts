import { DataTypes, Model, Sequelize } from 'sequelize';

export class StoreTheme extends Model {
  declare id: string;
  declare storeId: string;
  declare config: Record<string, unknown>;
  declare updatedAt: Date;
}

export const initStoreTheme = (sequelize: Sequelize): typeof StoreTheme => {
  StoreTheme.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      storeId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      config: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
          primaryColor: '#000000',
          secondaryColor: '#FFFFFF',
          fontFamily: 'Inter',
          fontSize: '16px',
          borderRadius: '8px',
          buttonStyle: 'rounded',
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'store_themes',
      timestamps: false,
      indexes: [{ fields: ['storeId'] }],
    }
  );

  return StoreTheme;
};
