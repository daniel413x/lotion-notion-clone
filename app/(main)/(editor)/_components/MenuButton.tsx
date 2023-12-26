'use client';

import { Button } from '@/components/ui/common/shadcn/button';
import { cn } from '@/lib/utils';
import {
  MenuIcon,
} from 'lucide-react';

interface MenuButtonProps {
  onResetWidth: () => void;
  isCollapsed: boolean;
}

const MenuButton = ({
  onResetWidth,
  isCollapsed,
}: MenuButtonProps) => (
  <Button
    className={cn('h-0 w-0 transition-all pointer-events-none', {
      'w-6 pointer-events-auto': isCollapsed,
    })}
    tabIndex={isCollapsed ? 0 : 1}
    variant="ghost"
    size="icon"
    onClick={onResetWidth}
  >
    <MenuIcon
      className="h-6 w-6 text-muted-foreground"
    />
  </Button>
);

export default MenuButton;
