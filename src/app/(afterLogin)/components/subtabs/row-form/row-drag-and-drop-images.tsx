'use client';
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { useFullscreen } from '@/hooks/use-fullscreen';
import crossCancelIcon from '@/../public/common/cross-cancel-icon.svg';
import exitFullScreen from '@/../public/common/exit-full-screen.svg';
import enterFullScreen from '@/../public/common/enter-full-screen.svg';
import externalLink from '@/../public/common/external-link.svg';
import plusCircleIcon from '@/../public/common/plus-circle-icon.svg';

export interface PreviewItem {
  src: string; // 썸네일(데이터URL or https)
  openUrl: string; // 새 창에서 열 URL(https or blob:)
  origin: 'db' | 'local';
  file?: File;
}

interface RowDragAndDropImagesProps {
  label: string;
  state: PreviewItem[];
  setState: React.Dispatch<React.SetStateAction<PreviewItem[]>>;
}

const RowDragAndDropImages: React.FC<RowDragAndDropImagesProps> = ({ label, state, setState }) => {
  const [modal, setModal] = React.useState(false);
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  const [image, setImage] = React.useState('');
  const [fullScreen, setFullScreen] = React.useState(false);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      const blobUrl = URL.createObjectURL(file); // 👈 새 창용 URL

      reader.onload = () => {
        if (reader.result) {
          setState((prev: PreviewItem[]) => [
            ...prev,
            {
              src: reader.result as string, // 미리보기(데이터URL)
              openUrl: blobUrl, // 새 창에서 열 URL(Blob)
              origin: 'local',
              file,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
  });

  const onFullS = (isFull: boolean) => {
    setFullScreen(isFull);
  };
  const { element, triggerFull, exitFull } = useFullscreen(onFullS);

  // const downloadButton = () => {
  //   console.log('Download', image);
  //   downloadFile(image, '최서윤_중상_의료자료111');
  // };

  React.useEffect(() => {
    const handleFullScreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setFullScreen(isFull);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  return (
    <>
      {modal && (
        <div className="flex flex-col w-fit h-fit max-w-200 max-h-250 overflow-auto z-10 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  border-2 bg-white rounded-2xl overflow-x-scroll">
          <div className="border h-10 flex items-center justify-end space-x-2 px-2 bg-primary-50">
            <Button
              variant="ghost"
              size="icon"
              className="w-fit h-fit"
              onClick={() => {
                window.open(image);
              }}
            >
              <Image src={externalLink} alt="전체화면 아이콘" height={25} width={25} />
            </Button>
            {/*<Button variant="ghost" size="icon" className="w-fit h-fit" onClick={downloadButton}>*/}
            {/*  <Image src={downloadIcon} alt="이미지 다운로드 아이콘" height={25} width={25} />*/}
            {/*</Button>*/}
            <Button variant="ghost" size="icon" onClick={triggerFull} className="w-fit h-fit">
              <Image src={enterFullScreen} alt="전체화면 아이콘" height={25} width={25} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setModal(false)}
              className="w-fit h-fit"
            >
              <Image src={crossCancelIcon} alt="취소아이콘" height={25} width={25} />
            </Button>
          </div>
          <div className=" w-fit h-fit" ref={element}>
            <Image
              src={image}
              alt="미리보기"
              loading="lazy"
              priority={false}
              width={size.w || 400}
              height={size.h || 400}
              onLoadingComplete={(img) => {
                setSize({ w: img.naturalWidth, h: img.naturalHeight });
              }}
              style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
            />
            <div className="w-fit flex space-x-2">
              <button
                onClick={exitFull}
                className={cn(
                  'bg-gray-200 p-1 w-fit h-fit rounded-2xl',
                  fullScreen ? 'block' : 'hidden'
                )}
              >
                <Image src={exitFullScreen} alt="전체화면취소아이콘" height={25} width={25} />
              </button>
              {/*<Button*/}
              {/*  variant="ghost"*/}
              {/*  size="icon"*/}
              {/*  className={cn(*/}
              {/*    fullScreen ? 'block' : 'hidden',*/}
              {/*    'bg-gray-200 p-1 rounded-2xl w-fit h-fit '*/}
              {/*  )}*/}
              {/*  onClick={downloadButton}*/}
              {/*>*/}
              {/*  <Image src={downloadIcon} alt="이미지 다운로드 아이콘" height={25} width={25} />*/}
              {/*</Button>*/}
            </div>
          </div>
        </div>
      )}
      <div className="w-full h-fit border rounded-lg flex flex-col px-4 py-4 space-x-4">
        <p className="whitespace-nowrap font-14-bold py-4">{label}</p>
        <hr className="border-gray-300" />
        <div className="w-full h-68 py-4 flex items-center space-x-4">
          {state.length > 0 ? (
            <>
              {state.map((item, index) => (
                <div key={index} className="w-30 h-60 relative rounded-md">
                  <Image
                    src={item.src}
                    loading="lazy"
                    priority={false}
                    width={300}
                    height={300}
                    style={{ objectFit: 'cover', width: 'auto', height: '100%' }}
                    alt="미리보기"
                    className="object-contain"
                    onClick={() => {
                      setModal(true);
                      setImage(item.openUrl);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(event) => {
                      event.stopPropagation();
                      setState((prev) => {
                        const newPreview = [...prev];
                        newPreview.splice(index, 1);
                        return newPreview;
                      });
                    }}
                    className="absolute top-1 right-1 w-fit h-fit cursor-pointer"
                  >
                    <Image src={crossCancelIcon} alt="취소아이콘" height={25} width={25} />
                  </Button>
                </div>
              ))}
            </>
          ) : (
            <div className="w-30 h-60 relative rounded-md font-12-bold text-gray-400 flex justify-center items-center">
              <p>이미지를 추가해주세요.</p>
            </div>
          )}
          <div
            {...getRootProps()}
            className="w-30 h-60 border-2 border-gray-300 hover:bg-gray-200 rounded-md flex items-center justify-center font-12-medium text-black"
          >
            <input {...getInputProps()} />
            <div className="w-full h-fit flex flex-col items-center space-y-2">
              <Image src={plusCircleIcon} alt="추가 아이콘" height={22} width={22} />
              <p>추가 자료 업로드</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(RowDragAndDropImages);
