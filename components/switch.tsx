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
            ? 'bg-green-pure dark:bg-green-pure/75 focus:bg-green-pure/20 group-hover:bg-green-pure/70 dark:group-hover:bg-green-pure/40'
            : 'bg-grey-light dark:bg-grey-light/40 focus:bg-grey-light/20 group-hover:bg-grey-light/70 dark:group-hover:bg-grey-light/40'
        }`}
      ></div>
      <div
        className="dark:bg-light absolute flex h-5 w-5 items-center justify-center rounded-full bg-white transition-transform duration-300 ease-out"
        style={{
          top: 'calc(50% - 0.625rem)',
          transform: `translateX(${checked ? 'calc(2px + 1.25rem)' : '2px'})`,
        }}
      ></div>
    </div>
  );
}
