import { Document } from 'mongoose';

export interface FavoriteType extends Document {
  clientId: string;
  products: FavoriteItem[];
}

interface FavoriteItem {
  productId: string;
  quantity: number;
}
