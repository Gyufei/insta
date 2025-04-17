export function RegisterSuccess({ name }: { name: string }) {
  return (
    <div className="flex flex-col space-y-4 items-center mt-4">
      <p className="font-bold text-xl">Register success!</p>
      <p className="font-semibold text-base pb-6 text-center">
        You are now the owner of{' '}
        <span
          className="font-bold text-base"
          style={{
            background: 'linear-gradient(45deg, #9e055c, #95045d 10%, #8c035c 20%, #83025c 30%, #740155 40%, #6a0152 50%, #61004f 60%, #5c0057 70%, #54005c 80%, #48005c 90%, #380057)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >{name}.nad</span>
      </p>
    </div>
  );
}
