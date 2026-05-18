type Props = {
  pageNo: number | null;
};

export function PageNo({ pageNo }: Props) {
  if (!pageNo) return null;
  return (
    <span className="inline-flex items-center my-1 px-1.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary self-start">
      p.{pageNo}
    </span>
  );
}
