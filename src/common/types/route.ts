import { menuItemSchema } from "@/configs/schema/admin";
import React from "react";
import * as z from "zod";

export type WrapperComponentProps = {
  children: React.ReactNode;
};
export type WrapperComponent<T extends WrapperComponentProps> = (
  props: T,
) => React.JSX.Element;

export type LazyReactNode<T extends WrapperComponentProps> =
  | WrapperComponent<T>
  | React.LazyExoticComponent<WrapperComponent<T>>;

export type MenuItemType = z.infer<typeof menuItemSchema>;
