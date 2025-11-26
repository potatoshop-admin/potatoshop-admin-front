'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UseInput, useInput } from '@/hooks/use-input';
import {
  useDeleteItem,
  useDeleteItemImages,
  useGetItem,
  usePatchItems,
  usePostItemImages,
} from '@/api/items';
import { Button } from '@/components/ui/button';
import {
  RowDisplay,
  RowDragAndDropImages,
  RowInput,
  RowSelect,
} from '@/app/(afterLogin)/components/subtabs/row-form';
import { PreviewItem } from '@/app/(afterLogin)/components/subtabs/row-form/row-drag-and-drop-images';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Category, Images, Item, Season } from '@/types/item';
import { categoriesSelect, seasonsSelect } from '@/constants';

const ItemEdit = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isSuccess } = useGetItem({ id: Number(id) });
  const { mutate: itemEdit } = usePatchItems({
    onSuccess: (data) => {
      toast.success(data.statusMessage);
      router.back();
    },
  });
  const { mutate: imageUpload } = usePostItemImages();
  const { mutate: imageDelete } = useDeleteItemImages({
    onSuccess: () => {
      const uploadFiles = images.map((img) => img.file).filter((f): f is File => f instanceof File);
      if (uploadFiles.length > 0) {
        imageUpload({
          id: Number(id),
          file: uploadFiles,
        });
      }
    },
  });
  const { mutate: deleteItem } = useDeleteItem({
    onSuccess: (e) => {
      toast.success(e.statusMessage);
      router.back();
    },
  });

  const validateData = (value: string | number): boolean => {
    if (value === '') return true;
    // 숫자인 경우 (0 포함) 허용
    if (!isNaN(Number(value)) && /^\d+$/.test(String(value))) {
      return true;
    }
    // 나머지 경우는 거부 (문자 포함된 경우 등)
    return false;
  };

  const title: UseInput = useInput('');
  const description: UseInput = useInput('');
  const stock: UseInput = useInput('');
  const costPrice: UseInput = useInput(0, validateData);
  const listPrice: UseInput = useInput(0, validateData);
  const discountRateBps = useInput(0, validateData);
  const [originTitle, setOriginTitle] = React.useState<string>('');
  const [category, setCategory] = React.useState<string>('');
  const [salePrice, setSalePrice] = React.useState<number>(0);
  const [season, setSeason] = React.useState<string>('');
  const [images, setImages] = React.useState<PreviewItem[]>([]);

  const originItemRef = React.useRef<Item | null>(null);
  const imageRef = React.useRef<Images[]>(null);

  const handleDeleteItem = () => {
    deleteItem({ id: Number(id) });
  };
  React.useEffect(() => {
    if (isSuccess) {
      toast.success(`${data.statusMessage}`);

      const item: Item = data.data;
      originItemRef.current = item;
      title.changeValue(item.title as string);
      description.changeValue(item.description as string);
      stock.changeValue(item.stock as number);
      costPrice.changeValue(item.costPrice as number);
      listPrice.changeValue(item.listPrice as number);
      discountRateBps.changeValue(item.discountRateBps as number);
      setOriginTitle(item.title);
      setSeason(item.season as Season);
      setSalePrice(item.salePrice as number);
      setCategory(item.category as Category);
      const dbImages: PreviewItem[] = item.images.map((img) => ({
        src: img.url,
        openUrl: img.url,
        origin: 'db',
      }));
      setImages(dbImages);

      imageRef.current = item.images;
    }
  }, [isSuccess]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      const rate: number = Number(discountRateBps.value) / 100;
      const salePriceValue: number = Math.floor(Number(listPrice.value) * (1 - rate));
      setSalePrice(salePriceValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [listPrice.value, discountRateBps.value]);

  return (
    <div className="h-full w-full px-4 py-4 overflow-y-scroll">
      <Dialog>
        <div className="w-full h-fit pb-6 flex justify-between items-center">
          <h1 className="font-24-extrabold sm:text-[28px]">{originTitle}</h1>
          <DialogTrigger asChild>
            <Button variant="destructive" size="roundedDefault">
              아이템 삭제
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogTitle>아이템 삭제</DialogTitle>
          <p>해당 아이템을 삭제하시겠습니까?</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" size="default" variant="outline">
                취소
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" size="default" variant="default" onClick={handleDeleteItem}>
                확인
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="overflow-hidden rounded-md border-2 border-gray-200 px-4 py-4 space-y-6">
        <RowInput
          value={title.value}
          onChange={title.onChange}
          label="제품 이름"
          placeholder="변경할 제품 이름을 기입하시오"
        />
        <RowInput
          value={description.value}
          onChange={description.onChange}
          label="제품 설명"
          placeholder="변경할 제품 설명을 기입하시오"
        />
        <RowSelect
          label="카테고리"
          options={categoriesSelect}
          value={category}
          onChange={setCategory}
          placeholder="상품 카테고리를 선택하세요"
        />
        <RowInput
          value={stock.value}
          onChange={stock.onChange}
          label="재고 수량"
          placeholder="변경할 제품 재고량을 기입하시오"
        />
        <RowSelect
          label="시즌"
          options={seasonsSelect}
          value={season}
          onChange={setSeason}
          placeholder="상품 시즌을 선택하세요"
        />
        <RowInput
          value={costPrice.value}
          onChange={costPrice.onChange}
          label="원가"
          placeholder="원가격을 입력하세요"
          inputAssist="원"
        />
        <RowInput
          value={listPrice.value}
          onChange={listPrice.onChange}
          label="정가"
          placeholder="정가격을 입력하세요"
          inputAssist="원"
        />
        <RowDisplay label="판매가" value={salePrice} inputAssist="원" />
        <RowInput
          value={discountRateBps.value}
          onChange={discountRateBps.onChange}
          label="할인율"
          placeholder="적용할 할인율을 기입하시오"
          inputAssist="%"
        />
        <RowDragAndDropImages label="상품 이미지" state={images} setState={setImages} />
        <div className="w-full space-x-2 flex h-fit">
          <Button variant="outline" size="fullWidth" className="flex-1/2">
            편집 취소
          </Button>
          <Button
            variant="default"
            size="fullWidth"
            className="flex-1/2"
            onClick={() => {
              itemEdit({
                id: Number(id),
                item: {
                  title: title.value as string,
                  description: description.value as string,
                  stock: Number(stock.value),
                  costPrice: Number(costPrice.value),
                  listPrice: Number(listPrice.value),
                  discountRateBps: Number(discountRateBps.value),
                  category: category as Category,
                  salePrice,
                  season: season as Season,
                },
              });
              const deleteFiles = images
                .filter((image) => image.src.startsWith('https://'))
                .map((image) => image.src);
              imageDelete({
                id: Number(id),
                file: deleteFiles,
              });
            }}
          >
            아이템 편집
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemEdit;
