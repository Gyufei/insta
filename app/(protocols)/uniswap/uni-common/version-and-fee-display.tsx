export function VersionAndFeeDisplay({ version, fee }: { version: string; fee: string }) {
  return (
    <div className="flex bg-gray-200 text-xs rounded-md items-center justify-between text-gray-400">
      <span className="px-2 border-r border-white">{version}</span>
      <span className="px-2">{fee}</span>
    </div>
  );
}
