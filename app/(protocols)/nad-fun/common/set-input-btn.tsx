import { Button } from "@/components/ui/button";

export function SetInputBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className="mt-1 w-14 px-1 py-0 h-6 text-xs font-semibold select-none"
    >
      {label}
    </Button>
  );
}
