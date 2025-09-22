'use client';
import type { ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function SubmitButton(props: ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} disabled={pending || props.disabled}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {props.children}
    </Button>
  );
}
