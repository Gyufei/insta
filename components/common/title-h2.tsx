import { ReactNode } from 'react';

export function TitleH2({ children }: { children: ReactNode }) {
  return <h2 className="text-xl 2xl:text-2xl font-semibold text-primary">{children}</h2>;
}
