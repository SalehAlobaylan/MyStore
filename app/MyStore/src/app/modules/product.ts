export interface Product {
  id: number;
  name: string;
  price: number;
  images: string;
  description: string;
  quantity?: number;
  index?: number;
}
export const productCount: string[] = ['1', '2', '3', '4', '5'];


// CREATE TABLE products (  id SERIAL PRIMARY KEY, name VARCHAR(255) ,price NUMERIC, images TEXT ,description TEXT ,quantity INTEGER DEFAULT 0, index INTEGER UNIQUE);