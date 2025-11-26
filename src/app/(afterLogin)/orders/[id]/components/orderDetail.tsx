'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteOrder, useGetOrder } from '@/api/orders';
import { toast } from 'sonner';
import { useOrderInfo } from '@/stores/useOrderInfo';
import { RowDisplay } from '@/app/(afterLogin)/components/subtabs/row-form';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Order, OrderItem } from '@/types/order';

const OrderDetail = ({ id }: { id: string }) => {
  const router = useRouter();

  const { data, isSuccess } = useGetOrder({ id: Number(id) });
  const { mutate } = useDeleteOrder({
    onSuccess: (e) => {
      toast.success(e.statusMessage);
      router.back();
    },
  });
  const { setOrderInfo } = useOrderInfo();

  const initialOrder: Order = {
    storeId: 0,
    ordersId: 0,
    orderItems: [],
    orderStatus: 'PAID',
    user: {
      userId: 0,
      name: '',
      age: 0,
      grade: 'BASIC',
    },
    address: '',
    totalPrice: 0,
    createdAt: '',
  };

  const deleteOrder = () => {
    mutate({ id: Number(id) });
  };

  const calculate = () => {
    let sum = 0;
    for (let i = 0; i < data?.data.orderItems.length; i++) {
      sum += data?.data.orderItems[i].profitAmount;
    }
    return sum;
  };

  React.useEffect(() => {
    if (data?.data) {
      toast.success(`${data.statusMessage}`);
      setOrderInfo(data.data);
    }
  }, [data?.data]);

  React.useEffect(() => {
    return () => setOrderInfo(initialOrder);
  }, []);

  if (!isSuccess) return <p>Loading.....</p>;
  return (
    <div className="h-full w-full px-4 py-4 overflow-y-scroll">
      <Dialog>
        <div className="w-full h-fit pb-6 flex justify-between items-center">
          <h1 className="font-24-extrabold sm:text-[28px]">{data?.data.name}</h1>
          <DialogTrigger asChild>
            <Button variant="destructive" size="roundedDefault">
              주뮨 삭제
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogTitle>주문 삭제</DialogTitle>
          <p>해당 주문을 삭제하시겠습니까?</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" size="default" variant="outline">
                취소
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" size="default" variant="default" onClick={deleteOrder}>
                확인
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="w-full h-fit rounded-md border-2 border-gray-200 px-4 py-4 space-y-6">
        <RowDisplay
          value={data?.data.user.name}
          inputAssist={`(${data?.data.user.grade})`}
          label="고객명"
        />
        <RowDisplay value={data?.data.user.age} label="고객 나이" />
        <RowDisplay value={data?.data.address} label="주소지" />
        <RowDisplay value={data?.data.orderStatus} label="주문 상태" />
        <RowDisplay value={data?.data.totalPrice} label="총 주문가격" inputAssist="원" />
        <div className="w-full h-fit max-h-150 pb-1 space-y-2 overflow-scroll">
          <RowDisplay value={calculate()} label="총 판매이익" inputAssist="원" />
          {data?.data.orderItems.map((item: OrderItem) => (
            <div key={item.itemId} className="border-2 rounded-2xl w-full h-fit p-4 space-y-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between ">
                <p className="font-16-medium text-gray-600 w-40 whitespace-nowrap">상품명</p>
                <div className="w-fit flex space-x-2 items-center font-14-bold text-gray-900">
                  {item.itemTitle}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between ">
                <p className="font-16-medium text-gray-600 w-40 whitespace-nowrap">주문 수량</p>
                <div className="w-fit flex space-x-2 items-center font-14-bold text-gray-900">
                  {item.quantity}
                  <p className="font-14-medium pl-4">개</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between ">
                <p className="font-16-medium text-gray-600 w-40 whitespace-nowrap">원가</p>
                <div className="w-fit flex space-x-2 items-center font-14-bold text-gray-900">
                  {item.costPrice}
                  <p className="font-14-medium pl-4">원</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between ">
                <p className="font-16-medium text-gray-600 w-40 whitespace-nowrap">판매가</p>
                <div className="w-fit flex space-x-2 items-center font-14-bold text-gray-900">
                  {item.salePrice}
                  <p className="font-14-medium pl-4">원</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between ">
                <p className="font-16-medium text-gray-600 w-40 whitespace-nowrap">판매 이익</p>
                <div className="w-fit flex space-x-2 items-center font-14-bold text-gray-900">
                  {item.profitAmount}
                  <p className="font-14-medium pl-4">원</p>
                </div>
              </div>
            </div>
          ))}
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
              router.push(`/orders/${id}/edit`);
            }}
          >
            주문 정보 수정
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
