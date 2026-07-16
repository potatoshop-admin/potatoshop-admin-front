export interface Images {
  itemImageId: number;
  sortOrder: number;
  url: string;
  /** 원본 이미지 S3 URL (압축 전 백업) — 백엔드에서 이중 저장 시 제공 */
  originalUrl?: string;
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
}
