'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGetAllItems } from '@/api/items';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/loading';
import { URL } from '@/constants';
import { Item } from '@/types/item';

const Edit = () => {
  const { data, isSuccess } = useGetAllItems();
  const router = useRouter();

  const btnEditItem = (id: number) => {
    router.push(`${URL.PRODUCTS_MANAGEMENT_EDIT}/${id}`);
  };

  if (!isSuccess) {
    return <Loading />;
  }
  return (
    <div className="p-4">
      <h1 className="font-24-extrabold sm:text-[28px]">PRODUCTS_MANAGEMENT_EDIT</h1>
      <div className="w-full h-full grid-cols-3 grid sm:grid-cols-4 xl:grid-cols-6 gap-4 pt-4">
        {data.data.map((item: Item) => (
          <div className="h-100 overflow-scroll border-2 rounded-lg p-2" key={item.itemId}>
            <div className="w-full h-fit flex justify-between">
              <h2 className="font-20-bold">{item.title}</h2>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => {
                  btnEditItem(item.itemId);
                }}
              >
                편집
              </Button>
            </div>
            <p className="font-14-medium text-gray-800">{item.description}</p>
            {item.images.length > 0 && (
              <div className="h-fit w-full mt-4">
                <Image
                  src={item.images[0].url}
                  alt={item.title}
                  height={300}
                  width={100}
                  style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  priority
                />
              </div>
            )}
            <div className="w-full h-fit space-y-2 pt-4">
              <p className="font-14-medium text-gray-700">원가: {item.costPrice}</p>
              <p className="font-14-medium text-gray-700">정가: {item.listPrice}</p>
              <p className="font-14-medium text-gray-700">판매가: {item.salePrice}</p>
              <p className="font-14-medium text-gray-700">시즌: {item.season}</p>
              <p className="font-14-medium text-gray-700">카테고리: {item.category}</p>
              <p className="font-14-medium text-gray-700">재고수량: {item.stock}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Edit;
