'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteOrder, useGetOrder } from '@/api/orders';
import { toast } from 'sonner';
import { useOrderInfo } from '@/stores/useOrderInfo';
import { RowDisplay, RowTwoButtons } from '@/app/(afterLogin)/components/subtabs/row-form';
import DeleteDialog from '@/app/(afterLogin)/components/subtabs/delete-dialog';
import Loading from '@/components/ui/loading';
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

  const editBtn = () => {
    router.push(`/orders/${id}/edit`);
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

  if (!isSuccess) {
    return <Loading />;
  }
  return (
    <div className="h-full w-full px-4 py-4 overflow-y-scroll">
      <DeleteDialog title={data?.data.name} item="주문" onClick={deleteOrder} />
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
        <RowTwoButtons confirmTitle="주문정보 수정" cancelTitle="뒤로 돌아가기" onClick={editBtn} />
      </div>
    </div>
  );
};

export default OrderDetail;
