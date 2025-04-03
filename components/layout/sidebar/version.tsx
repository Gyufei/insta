interface VersionProps {
  version: string;
}

export function Version({ version }: VersionProps) {
  return (
    <div className="text-grey-pure mt-auto w-full justify-self-end py-4 text-center text-xs">
      {version}
    </div>
  );
} 