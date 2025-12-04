'use client';

import React, { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { usePatchCs } from '@/api/cs';
import { useCsInfo } from '@/stores/useCsInfo';
import { getChangedFields } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { RowDisplay } from '@/app/(afterLogin)/components/subtabs/row-form';
import RowTextarea from '@/app/(afterLogin)/components/subtabs/row-form/row-textarea';
import { Cs } from '@/types/cs';

export default function CsEditModal() {
  const router = useRouter();
  const { cs } = useCsInfo();
  const { mutate } = usePatchCs({
    onSuccess: (e) => {
      toast.success(`${e.statusMessage}`);
    },
  });

  const [disabled, setDisabled] = React.useState(true);
  const [answer, setAnswer] = React.useState<string>(cs.answer ? cs.answer : '');

  const handleClose = () => {
    router.back();
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newData: Partial<Cs> = {
      answer: answer,
    };

    const changedValue: Partial<Cs> = getChangedFields(cs, newData);
    mutate({ id: cs.csId, cs: changedValue });
    router.back();
  };
  React.useEffect(() => {
    if (answer.length < 1) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [answer]);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogTitle>문의 응답</DialogTitle>
        <form className="space-y-4" onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}>
          <RowDisplay value={cs.question} label="문의" />
          <RowTextarea label="답변" value={answer} setState={setAnswer} />
          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button type="button" onClick={handleClose} size="default" variant="outline">
                취소
              </Button>
            </DialogClose>
            <DialogClose asChild disabled={disabled}>
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
