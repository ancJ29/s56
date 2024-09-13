import { WrapperComponentProps } from "@/common/types";

export default function BlankWrapper(props: WrapperComponentProps) {
  return <>{props.children}</>;
}
