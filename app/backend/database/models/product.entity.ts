import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", nullable: true })
  name?: string;

  @Column({ type: "numeric", nullable: true })
  price?: number;

  // This is the critical part - the format depends on how data is stored in PostgreSQL
  // If stored as text[], TypeORM should handle the conversion
  @Column("text", { array: true, nullable: true })
  images?: string[];

  @Column("text", { nullable: true })
  description?: string;
}
