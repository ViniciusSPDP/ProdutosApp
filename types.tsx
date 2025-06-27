export interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    description: string;
    category: string; 
}

export interface CartItem extends Product {
  quantity: number;
}