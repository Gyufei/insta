export function TitleRow({ title }: { title: string }) {
  return (
    <div className="mt-6 flex w-full flex-shrink-0 justify-between px-4 2xl:mt-4 2xl:px-12">
      <h3 className="text-primary text-xl font-semibold">{title}</h3>
    </div>
  );
}
