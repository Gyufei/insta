interface VersionProps {
  version: string;
}

export function Version({ version }: VersionProps) {
  return <div className="w-full justify-self-end text-center text-xs text-pro-gray">{version}</div>;
}
