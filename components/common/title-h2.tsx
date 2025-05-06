import { ReactNode } from 'react';

export function TitleH2({ children }: { children: ReactNode }) {
  return <h2 className="text-xl font-medium text-primary">{children}</h2>;
}
