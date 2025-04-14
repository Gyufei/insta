'use client';

export function Switch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  const handleToggle = (val: boolean) => {
    if (disabled) return;
    onChange(val);
  };

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      className={`group relative flex items-center ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      }`}
      onClick={() => handleToggle(!checked)}
    >
      <div
        className={`box-content flex h-5 w-10 rounded-full p-[2px] transition-colors duration-75 ${
          checked
            ? 'bg-green dark:bg-green/75 focus:bg-green/20 group-hover:bg-green/70 dark:group-hover:bg-green/40'
            : 'bg-gray-200 group-hover:bg-gray-200/70 focus:bg-gray-200/20 dark:bg-gray-200/40 dark:group-hover:bg-gray-200/40'
        }`}
      ></div>
      <div
        className="bg-foreground absolute flex h-5 w-5 items-center justify-center rounded-full transition-transform duration-300 ease-out"
        style={{
          top: 'calc(50% - 0.625rem)',
          transform: `translateX(${checked ? 'calc(2px + 1.25rem)' : '2px'})`,
        }}
      ></div>
    </div>
  );
}
