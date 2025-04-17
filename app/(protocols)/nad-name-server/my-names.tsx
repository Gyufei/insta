'use client';

import { Sparkle } from 'lucide-react';

import { Empty } from '@/components/empty';
import { TitleH2 } from '@/components/title-h2';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WithLoading } from '@/components/with-loading';

import { useSideDrawerStore } from '@/lib/state/side-drawer';

import { useNadNameCombinedNames } from './use-my-names';

export function MyNames() {
  const { setCurrentComponent } = useSideDrawerStore();
  const { data: names, isLoading } = useNadNameCombinedNames();

  function handleSetPrimary(name: string) {
    setCurrentComponent({
      name: 'NadNameSetPrimary',
      props: {
        registerName: name,
      },
    });
  }

  return (
    <div className="container px-4 2xl:px-12 mt-6 2xl:mt-4">
      <TitleH2>My names</TitleH2>

      {isLoading ? (
        <div className="mt-4 flex h-[200px] w-full items-center justify-center">
          <WithLoading isLoading={isLoading} />
        </div>
      ) : names.length === 0 ? (
        <Empty title="No Nad names" description="You don't have any Nad names yet." />
      ) : (
        <div className="space-y-4 mt-4">
          {names.map((name) => (
            <Card
              key={name.id}
              className="py-0 hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-900 to-purple-500" />
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-medium">{name.name}.nad</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {name.isPrimary ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 hover:bg-green-100 py-2"
                    >
                      <Sparkle className="w-4 h-4" />
                      Your primary name
                    </Badge>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-primary-foreground text-primary"
                      onClick={() => handleSetPrimary(name.name)}
                    >
                      Set as primary
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
