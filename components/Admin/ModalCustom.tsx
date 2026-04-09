"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
};
export default function ModalCustom({
  title,
  children,
  onClose,
  open,
  onOpenChange,
  showTrigger = true,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose?.();
        onOpenChange?.(o);
      }}
    >
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline">{title}</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-xxl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
