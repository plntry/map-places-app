import { cn } from "@/utils/styles";

export const Dot = ({
  number,
  className,
  style,
}: {
  number: number;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-base",
        className
      )}
      style={style}
    >
      {number}
    </span>
  );
};
