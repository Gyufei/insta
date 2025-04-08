export function SetInputBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="border-grey hover:border-dark-500 mt-1 flex cursor-pointer items-center rounded-sm border px-1 py-1 text-xs font-semibold select-none hover:text-black"
    >
      {label}
    </button>
  );
}
