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
