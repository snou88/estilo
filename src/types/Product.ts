export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
}
