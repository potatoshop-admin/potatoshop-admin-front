'use client';
import React from 'react';
import { toast } from 'sonner';
import { usePostItemImages, usePostItems } from '@/api/items';
import { useInput } from '@/hooks/use-input';
import { Button } from '@/components/ui/button';
import {
  RowDisplay,
  RowDragAndDropImages,
  RowInput,
  RowSelect,
} from '@/app/(afterLogin)/components/subtabs/row-form';
import { PreviewItem } from '@/app/(afterLogin)/components/subtabs/row-form/row-drag-and-drop-images';
import { ApiResponseType } from '@/types/api';
import { Item } from '@/types/item';
import { categoriesSelect, seasonsSelect } from '@/constants';

const Create = () => {
  const { mutate: imageUpload } = usePostItemImages();
  const { mutate } = usePostItems({
    onSuccess: (e: ApiResponseType<Item>) => {
      const itemId = e.data?.itemId;
      if (images.length > 0) {
        const files = images.map((img) => img.file).filter((f): f is File => f instanceof File); // ✅ File 객체만 필터링
        imageUpload({
          id: Number(itemId),
          file: files,
        });
      }
      title.reset();
      description.reset();
      costPrice.reset();
      listPrice.reset();
      discountRateBps.reset();
      stock.reset();
      setCategory('');
      setSeason('');
      setImages([]);
      setSalePrice(0);
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

  const title = useInput('');
  const description = useInput('');
  const costPrice = useInput('0', validateData);
  const listPrice = useInput('0', validateData);
  const discountRateBps = useInput('0', validateData);
  const stock = useInput('0', validateData);

  const [category, setCategory] = React.useState<string>('');
  const [season, setSeason] = React.useState<string>('');
  const [images, setImages] = React.useState<PreviewItem[]>([]);
  const [salePrice, setSalePrice] = React.useState<number>(0);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      const rate: number = Number(discountRateBps.value) / 100;
      const salePriceValue: number = Number(listPrice.value) * (1 - rate);
      setSalePrice(salePriceValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [listPrice.value, discountRateBps.value]);

  React.useEffect(() => {
    console.log('Download', images);
  }, [images]);
  return (
    <div className="w-full h-full px-4 py-4 max-w-240">
      <div className="w-full h-full py-8 px-4 space-y-8 border border-gray-200 rounded-2xl">
        <h1 className="font-24-bold">상품 등록</h1>
        <div className="w-full h-fit space-y-2"></div>
        <RowInput
          value={title.value}
          onChange={title.onChange}
          label="상품 명"
          placeholder="상품 명을 입력하세요"
        />
        <RowInput
          value={description.value}
          onChange={description.onChange}
          label="상품 설명"
          placeholder="상품 설명을 입력하세요"
        />
        <RowSelect
          label="카테고리"
          options={categoriesSelect}
          value={category}
          onChange={setCategory}
          placeholder="상품 카테고리를 선택하세요"
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
        <RowInput
          value={discountRateBps.value}
          onChange={discountRateBps.onChange}
          label="할인율"
          placeholder="적용할 할인율을 기입하시오"
          inputAssist="%"
        />
        <RowDisplay label="판매가" value={salePrice} inputAssist="원" />
        <RowInput
          value={stock.value}
          onChange={stock.onChange}
          label="재고"
          placeholder="재고 갯수를 입력하세요"
          inputAssist="개"
        />
        <RowDragAndDropImages label="상품 이미지" state={images} setState={setImages} />
        <Button
          onClick={() => {
            const titleValue = title.value as string;
            const costPriceValue: number = Number(costPrice.value);
            const listPriceValue: number = Number(listPrice.value);
            const stockValue: number = Number(stock.value);
            if (titleValue === '') {
              toast.info('상품 명을 입력해주세요.');
              return;
            }
            if (category === '') {
              toast.info('상품 카테고리를 선택해주세요.');
              return;
            }
            if (season === '') {
              toast.info('상품 시즌을 선택해주세요.');
              return;
            }
            if (costPriceValue > listPriceValue) {
              toast.info('원가격보다 정가격이 낮게 기입되었습니다.');
              return;
            }
            if (stockValue === 0) {
              toast.info('상품 재고량을 입력해주세요.');
              return;
            }
            mutate({
              title: titleValue,
              description: description.value as string,
              category: category,
              season: season,
              costPrice: costPriceValue,
              listPrice: listPriceValue,
              discountRateBps: Number(discountRateBps.value),
              salePrice: salePrice,
              stock: stockValue,
            });
          }}
          className="w-full"
          variant="roundOutline"
          size="lg"
        >
          상품 등록
        </Button>
      </div>
    </div>
  );
};

export default Create;
