import { SelectType } from '@/app/(afterLogin)/components/subtabs/row-form/row-select';

export const orderStatusSelect: SelectType[] = [
  { label: '결제 완료', value: 'PAID' },
  { label: '상품 준비중', value: 'PROCESSING' },
  { label: '배송 중', value: 'SHIPPING' },
  { label: '배송 완료', value: 'DELIVERED' },
  { label: '취소 요청', value: 'CANCEL_REQUESTED' },
  { label: '취소 완료', value: 'CANCELLED' },
  { label: '교환 요청', value: 'EXCHANGE_REQUESTED' },
  { label: '교환 완료', value: 'EXCHANGED' },
  { label: '반품 요청', value: 'RETURN_REQUESTED' },
  { label: '반품 완료', value: 'RETURNED' },
];

export const gradeSelect: SelectType[] = [
  { label: '베이직회원', value: 'BASIC' },
  { label: '블랙회원', value: 'BLACK' },
  { label: 'VIP회원', value: 'VIP' },
];

export const categoriesSelect: SelectType[] = [
  { label: 'Outwear', value: 'outwear' },
  { label: 'Top', value: 'top' },
  { label: 'Skirt', value: 'skirt' },
  { label: 'Pants', value: 'pants' },
  { label: 'Dress', value: 'dress' },
  { label: 'Acc', value: 'acc' },
];

export const seasonsSelect: SelectType[] = [
  { label: '현재 시즌', value: 'CURRENT' },
  { label: '아카이브', value: 'ARCHIVE' },
];
