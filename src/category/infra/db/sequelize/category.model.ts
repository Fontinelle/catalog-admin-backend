import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export type CategoryModelProps = {
  categoryId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
};

@Table({ tableName: 'categories', timestamps: false })
export class CategoryModel extends Model<CategoryModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID, field: 'category_id', allowNull: false })
  declare categoryId: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.BOOLEAN, field: 'is_active', allowNull: false })
  declare isActive: boolean;

  @Column({ type: DataType.DATE(3), field: 'created_at', allowNull: false })
  declare createdAt: Date;
}
