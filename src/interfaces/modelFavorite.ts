import { Document, ObjectId } from 'mongoose';

export interface FavoriteType extends Document {
  clientId: ObjectId;
  products: FavoriteItem[];
}

interface FavoriteItem {
  productId: ObjectId;
  quantity: number;
}
