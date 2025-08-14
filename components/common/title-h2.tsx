import { ReactNode } from 'react';

export function TitleH2({ children }: { children: ReactNode }) {
  return <h2 className="text-xl leading-[140%] font-medium text-primary">{children}</h2>;
}
