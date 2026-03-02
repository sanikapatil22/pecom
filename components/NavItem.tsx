"use client";
import Link, { LinkProps } from "next/link";
import React, { ReactNode } from "react";
import { cn } from "../lib/utils";

interface Props extends LinkProps {
  children?: ReactNode;
  className?: string;
  linkto?: string;
}

const NavItem = ({ ...props }: Props) => {

  return (
    <Link
      className={cn(
        "md:text-base text-xl",
      )}
      {...props}
    >
      {props.children}
    </Link>
  );
};

export default NavItem;
