'use client';

import { Button } from '@/components/ui/common/shadcn/button';
import { Id } from '@/convex/_generated/dataModel';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';

interface ItemProps {
  id?: Id<'documents'>;
  documentIcon?: string;
  expanded?: boolean;
  level?: number;
  isSearch?: boolean;
  // active?: boolean;
  // onExpand?: () => void;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
}

const Item = ({
  id,
  onClick,
  icon: Icon,
  label,
  // active,
  // onExpand,
  documentIcon,
  isSearch,
  expanded,
  level,
}: ItemProps) => {
  const ChevronIcon = expanded ? ChevronDown : ChevronUp;
  return (
    <div
      style={{ paddingLeft: `${level ? (level * 12) + 12 : '12'}px` }}
      className="relative bg-transparent group min-h-[27px] text-sm pr-3 py-1 w-full hover:bg-primary/5 flex text-muted-foreground font-medium justify-start items-center"
    >
      <Button
        variant="blank"
        className="inset-0 absolute w-full h-full"
        onClick={onClick}
      />
      {!!id && (
      <Button
        className="p-0 z-10"
        variant="ghost"
        onClick={() => {}}
      >
        <ChevronIcon />
      </Button>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">
          {documentIcon}
        </div>
      ) : (
        <Icon
          className="shrink-0 h-[18px] mr-2 text-muted-foreground"
        />
      )}
      <span className="truncate">
        {label}
      </span>
      {isSearch && (
        <kbd
          className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
        >
          <span
            className="text-xs pt-0.5"
          >
            &#8984;
          </span>
          <span>
            K
          </span>
        </kbd>
      )}
    </div>
  );
};

export default Item;
