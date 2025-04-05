import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", nullable: false })
  fullName!: string;

  @Column({ type: "text", nullable: false })
  address!: string;

  // Note: In a production app, you should use a payment processor 
  // and not store full credit card information
  @Column({ type: "text", nullable: false })
  creditCardLast4!: string;

  @Column({ type: "numeric", nullable: false })
  total!: number;

  @CreateDateColumn()
  orderDate!: Date;

  @ManyToMany(() => Product)
  @JoinTable({
    name: "order_products",
    joinColumn: { name: "order_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "product_id", referencedColumnName: "id" }
  })
  products!: Product[];
} 