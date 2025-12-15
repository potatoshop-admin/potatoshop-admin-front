import {
  Archive,
  Handbag,
  List,
  LucideProps,
  MessageCircleQuestionMark,
  User,
  Wand,
} from 'lucide-react';
import * as react from 'react';

export const STATUS = {
  PRODUCTS_All: '전체 시즌',
  PRODUCTS_CURRENT: '현 시즌',
  PRODUCTS_ARCHIVE: '지난 시즌',
  PRODUCTS_MANAGEMENT_CREATE: '제품 등록',
  PRODUCTS_MANAGEMENT_EDIT: '제품 수정',
  ORDERS: '전체',
  ORDERS_PAID: '결제 완료',
  ORDERS_PROCESSING: '제품 준비 중',
  ORDERS_SHIPPING: '배송중',
  ORDERS_DELIVERED: '배송 완료',
  ORDERS_CANCEL_REQUESTED: '취소 요청',
  ORDERS_CANCELLED: '취소 완료',
  ORDERS_EXCHANGE_REQUESTED: '교환 요청',
  ORDERS_EXCHANGED: '교환 완료',
  ORDERS_RETURN_REQUESTED: '반품 요청',
  ORDERS_RETURNED: '반품 완료',
} as const;

export type StatusKey = keyof typeof STATUS;
export type StatusValue = (typeof STATUS)[StatusKey];

export const MENU = {
  DASHBOARD: '대시보드',
  PRODUCTS: '제품',
  PRODUCTS_MANAGEMENT: '제품 관리',
  ORDERS: '주문 목록',
  USERS: '유저 관리',
  CS: 'cs 문의',
  REVIEWS: '리뷰 관리',
} as const;

export type MenuKey = keyof typeof MENU;
export type MenuValue = (typeof MENU)[MenuKey];
export const URL = {
  DASHBOARD: '/',
  PRODUCTS: '/products',
  PRODUCTS_CURRENT: '/products/current',
  PRODUCTS_ARCHIVE: '/products/archive',
  PRODUCTS_MANAGEMENT: '/products-management',
  PRODUCTS_MANAGEMENT_CREATE: '/products-management/create',
  PRODUCTS_MANAGEMENT_EDIT: '/products-management/edit',
  ORDERS: '/orders',
  ORDERS_PAID: '/orders/paid',
  ORDERS_PROCESSING: '/orders/processing',
  ORDERS_SHIPPING: '/orders/shipping',
  ORDERS_DELIVERED: '/orders/delivered',
  ORDERS_CANCEL_REQUESTED: '/orders/cancel-requested',
  ORDERS_CANCELLED: '/orders/cancelled',
  ORDERS_EXCHANGE_REQUESTED: '/orders/exchange-requested',
  ORDERS_EXCHANGED: '/orders/exchanged',
  ORDERS_RETURN_REQUESTED: '/orders/return-requested',
  ORDERS_RETURNED: '/orders/returned',
  USERS: '/users',
  CS: '/cs',
  REVIEWS: '/reviews',
  EDIT: '/edit',
} as const;

export type UrlKey = keyof typeof URL;
export type UrlValue = (typeof URL)[UrlKey];

export interface SubMenuItemType {
  title: StatusValue;
  url: UrlValue;
}

export interface MenuItemType {
  title: MenuValue;
  url: UrlValue;
  icon: react.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & react.RefAttributes<SVGSVGElement>
  >;
  isActive?: boolean;
  items?: SubMenuItemType[];
}

export const MENU_ITEMS: MenuItemType[] = [
  {
    title: MENU.PRODUCTS,
    url: URL.PRODUCTS,
    icon: Handbag,
    isActive: true,
    items: [
      { title: STATUS.PRODUCTS_All, url: URL.PRODUCTS },
      { title: STATUS.PRODUCTS_CURRENT, url: URL.PRODUCTS_CURRENT },
      { title: STATUS.PRODUCTS_ARCHIVE, url: URL.PRODUCTS_ARCHIVE },
    ],
  },
  {
    title: MENU.PRODUCTS_MANAGEMENT,
    url: URL.PRODUCTS_MANAGEMENT,
    icon: Wand,
    isActive: true,
    items: [
      { title: STATUS.PRODUCTS_MANAGEMENT_CREATE, url: URL.PRODUCTS_MANAGEMENT_CREATE },
      { title: STATUS.PRODUCTS_MANAGEMENT_EDIT, url: URL.PRODUCTS_MANAGEMENT_EDIT },
    ],
  },
  {
    title: MENU.ORDERS,
    url: URL.ORDERS,
    icon: List,
    isActive: true,
    items: [
      { title: STATUS.ORDERS, url: URL.ORDERS },
      { title: STATUS.ORDERS_PAID, url: URL.ORDERS_PAID },
      { title: STATUS.ORDERS_PROCESSING, url: URL.ORDERS_PROCESSING },
      { title: STATUS.ORDERS_SHIPPING, url: URL.ORDERS_SHIPPING },
      { title: STATUS.ORDERS_DELIVERED, url: URL.ORDERS_DELIVERED },
      { title: STATUS.ORDERS_CANCEL_REQUESTED, url: URL.ORDERS_CANCEL_REQUESTED },
      { title: STATUS.ORDERS_CANCELLED, url: URL.ORDERS_CANCELLED },
      { title: STATUS.ORDERS_EXCHANGE_REQUESTED, url: URL.ORDERS_EXCHANGE_REQUESTED },
      { title: STATUS.ORDERS_EXCHANGED, url: URL.ORDERS_EXCHANGED },
      { title: STATUS.ORDERS_RETURN_REQUESTED, url: URL.ORDERS_RETURN_REQUESTED },
      { title: STATUS.ORDERS_RETURNED, url: URL.ORDERS_RETURNED },
    ],
  },
  {
    title: MENU.USERS,
    url: URL.USERS,
    icon: User,
  },
  {
    title: MENU.CS,
    url: URL.CS,
    icon: MessageCircleQuestionMark,
  },
  {
    title: MENU.REVIEWS,
    url: URL.REVIEWS,
    icon: Archive,
  },
];

export const BREAD_CRUMB_PATH = [
  { title: STATUS.ORDERS, url: URL.ORDERS },
  { title: STATUS.ORDERS_PAID, url: URL.ORDERS_PAID },
  { title: STATUS.ORDERS_PROCESSING, url: URL.ORDERS_PROCESSING },
  { title: STATUS.ORDERS_SHIPPING, url: URL.ORDERS_SHIPPING },
  { title: STATUS.ORDERS_DELIVERED, url: URL.ORDERS_DELIVERED },
  { title: STATUS.ORDERS_CANCEL_REQUESTED, url: URL.ORDERS_CANCEL_REQUESTED },
  { title: STATUS.ORDERS_CANCELLED, url: URL.ORDERS_CANCELLED },
  { title: STATUS.ORDERS_EXCHANGE_REQUESTED, url: URL.ORDERS_EXCHANGE_REQUESTED },
  { title: STATUS.ORDERS_EXCHANGED, url: URL.ORDERS_EXCHANGED },
  { title: STATUS.ORDERS_RETURN_REQUESTED, url: URL.ORDERS_RETURN_REQUESTED },
  { title: STATUS.ORDERS_RETURNED, url: URL.ORDERS_RETURNED },
];
