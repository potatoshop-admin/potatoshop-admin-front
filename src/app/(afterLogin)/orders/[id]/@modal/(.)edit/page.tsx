'use client';

import React, { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { usePatchOrder } from '@/api/orders';
import { useInput } from '@/hooks/use-input';
import { useOrderInfo } from '@/stores/useOrderInfo';
import { getChangedFields } from '@/lib/utils';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RowInput, RowSelect } from '@/app/(afterLogin)/components/subtabs/row-form';
import { User } from '@/types/user';
import { orderStatusSelect } from '@/constants';
import { Order, OrderStatus } from '@/types/order';

export default function UserEditModal() {
  const router = useRouter();
  const { order } = useOrderInfo();
  const { mutate } = usePatchOrder({
    onSuccess: (e) => {
      toast.success(`${e.statusMessage}`);
    },
  });

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newData: Partial<Order> = {
      orderStatus: orderStatus as OrderStatus,
      address: address.value as string,
    };

    const changedValue: Partial<User> = getChangedFields(order, newData);

    mutate({ id: order.ordersId, order: changedValue });
    router.back();
  };
  const [orderStatus, setOrderStatus] = React.useState<string>(order.orderStatus);
  const address = useInput(order.address);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogTitle>주문 정보 수정</DialogTitle>
        <form className="space-y-4" onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}>
          <RowInput
            value={address.value}
            onChange={address.onChange}
            label="주소"
            placeholder="주소를 입력하세요"
          />
          <RowSelect
            label="카테고리"
            options={orderStatusSelect}
            value={orderStatus}
            onChange={setOrderStatus}
            placeholder="상품 카테고리를 선택하세요"
            disabled={order.orderStatus === 'DELIVERED'}
          />

          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button type="button" onClick={handleClose} size="default" variant="outline">
                취소
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" size="default" variant="default">
                저장
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
