import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  subTitle?: string;
  color?: string;
  size?: string;
  className?: string;
  children: React.ReactNode;
};

const Heading = ({
  level = 2,
  color = "text-black",
  size = "text-2xl",
  className = "",
  subTitle = "Sub title",
  children,
}: Props) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={cn(
        color,
        size,
        className,
        "flex w-full flex-col items-start justify-between gap-2 font-bold text-color-2"
      )}
    >
      {children}
      {subTitle && (
        <span className="text-sm font-normal text-gray-500">{subTitle}</span>
      )}
    </Tag>
  );
};

export default Heading;
