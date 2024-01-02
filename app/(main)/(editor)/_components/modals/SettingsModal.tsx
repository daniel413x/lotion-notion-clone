import {
  Dialog, DialogContent, DialogHeader,
} from '@/components/ui/common/shadcn/dialog';
import { ModeToggle } from '@/components/ui/common/ModeToggle';
import { Label } from '@/components/ui/common/shadcn/label';
import useSettingsModal from '../../_hooks/useSettingsModal';

const SettingsModal = () => {
  const {
    onClose,
    isOpen,
  } = useSettingsModal();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">
            My settings
          </h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>
              Appearance
            </Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Lotion looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
