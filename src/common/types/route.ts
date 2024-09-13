import { menuItemSchema } from "@/configs/schema/admin";
import React from "react";
import * as z from "zod";

export type WrapperComponentProps = {
  children: React.ReactNode;
};
export type WrapperComponent = (
  props: WrapperComponentProps,
) => React.JSX.Element;

export type LazyReactNode =
  | WrapperComponent
  | React.LazyExoticComponent<WrapperComponent>;

export type MenuItemType = z.infer<typeof menuItemSchema>;
