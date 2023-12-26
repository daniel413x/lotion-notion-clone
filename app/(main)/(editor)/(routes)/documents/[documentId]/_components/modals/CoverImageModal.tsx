import {
  Dialog, DialogContent, DialogHeader,
} from '@/components/ui/common/shadcn/dialog';
import { useState } from 'react';
import { useEdgeStore } from '@/lib/edgestore';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import useCoverImageModal from './useCoverImageModal';
import { SingleImageDropzone } from '../SingleImageDropzone';

const CoverImageModal = () => {
  const params = useParams();
  const {
    onClose,
    isOpen,
    coverImageReplacementUrl,
  } = useCoverImageModal();
  const update = useMutation(api.documents.update);
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>();
  const { edgestore } = useEdgeStore();
  const onCloseModal = () => {
    setFile(undefined);
    setIsSubmitting(false);
    onClose();
  };
  const onChange = async (f: File | undefined) => {
    if (f) {
      setIsSubmitting(true);
      setFile(f);
      const res = await edgestore.publicFiles.upload({
        file: f,
        options: {
          // will handle either create (url=undefined) or update (url passed on modal open)
          replaceTargetUrl: coverImageReplacementUrl,
        },
      });
      await update({
        id: params.documentId as Id<'documents'>,
        coverImage: res.url,
      });
      onCloseModal();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onCloseModal}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">
            My settings
          </h2>
        </DialogHeader>
        <div>
          <SingleImageDropzone
            className="w-full outline-none"
            disabled={isSubmitting}
            value={file}
            onChange={onChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoverImageModal;
