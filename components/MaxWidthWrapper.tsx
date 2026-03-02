import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const SmallerMaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-2xl my-28 px-1.5 md:px-6",
        className
      )}
    >
      {children}
    </div>
  );
};

export default SmallerMaxWidthWrapper;
