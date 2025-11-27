'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useGetItem } from '@/api/items';
import { RowDisplay } from '@/app/(afterLogin)/components/subtabs/row-form';
import { Button } from '@/components/ui/button';
import { Images, Item } from '@/types/item';
import { URL } from '@/constants';
import Loading from '@/components/ui/loading';

const ItemDetail = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isSuccess } = useGetItem({ id: Number(id) });

  const [item, setItem] = React.useState<Item>({
    itemId: 0,
    storeId: 0,
    title: '',
    description: '',
    category: 'top',
    season: 'CURRENT',
    stock: 0,
    costPrice: 0,
    salePrice: 0,
    listPrice: 0,
    currentProfitAmount: 0,
    currentProfitRateBps: 0,
    discountRateBps: 0,
    images: [],
  });

  React.useEffect(() => {
    if (isSuccess) {
      toast.success(`${data.statusMessage}`);
      setItem(data.data);
    }
  }, [isSuccess]);

  if (!isSuccess) {
    return <Loading />;
  }
  return (
    <div className="h-full w-full px-4 py-4 overflow-y-scroll">
      <div className="w-full h-fit pb-6">
        <h1 className="font-24-extrabold sm:text-[28px]">{item?.title}</h1>
      </div>

      <div className="w-full h-fit rounded-md border-2 border-gray-200 px-4 py-4 space-y-6">
        <RowDisplay value={item?.description} label="제품 설명" />
        <RowDisplay value={item?.category} label="카테고리" />
        <RowDisplay value={item?.season} label="제품 시즌" />
        <RowDisplay value={item?.stock} label="재고 (개)" />
        <RowDisplay value={item?.costPrice} label="costPrice (원)" />
        <RowDisplay value={item?.salePrice} label="salePrice (원)" />
        <RowDisplay value={item?.listPrice} label="listPrice (원)" />
        <RowDisplay value={item?.currentProfitAmount} label="currentProfitAmount (원)" />
        <div className=" w-full h-80 flex py-2 space-x-2 overflow-x-auto ">
          {item?.images.length > 0 ? (
            item?.images.map((image: Images, i: number) => (
              <Image
                src={image.url}
                key={i}
                alt={`${item.title}+${i}`}
                height={300}
                width={1000}
                style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                priority
              />
            ))
          ) : (
            <p>이미지가 없습니다.</p>
          )}
        </div>
        <div className="w-full h-fit flex space-x-2">
          <Button
            variant="outline"
            size="fullWidth"
            className="flex-1/2"
            onClick={() => {
              router.back();
            }}
          >
            뒤로 돌아가기
          </Button>
          <Button
            variant="default"
            size="fullWidth"
            className="flex-1/2"
            onClick={() => {
              router.push(`${URL.PRODUCTS_MANAGEMENT_EDIT}/${id}`);
            }}
          >
            제품 수정
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
