export interface Images {
  itemImageId: number;
  sortOrder: number;
  url: string;
}

export type Category = 'outwear' | 'top' | 'skirt' | 'pants' | 'dress' | 'acc';
export type Season = 'CURRENT' | 'ARCHIVE';

export interface Item {
  itemId: number;
  storeId: number;
  title: string;
  description: string;
  category: Category;
  costPrice: number;
  listPrice: number;
  salePrice: number;
  discountRateBps: number;
  stock: number;
  season: Season;
  images: Images[];
  currentProfitAmount: number;
  currentProfitRateBps: number;
}
