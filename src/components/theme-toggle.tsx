'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 rounded-xl text-muted-foreground"
        disabled
      >
        <Sun className="h-5 w-5" />
        Theme
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-sidebar-hover-bg"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
    </Button>
  );
}
