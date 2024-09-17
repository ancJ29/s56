import { ActionIcon, Affix } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

type CAddIconProps = {
  visible?: boolean;
  hidden?: boolean;
  onClick?: () => void;
};

export function CAddIcon({ hidden = false, onClick }: CAddIconProps) {
  if (hidden) {
    return <></>;
  }
  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <ActionIcon
        variant="filled"
        bg={"primary.8"}
        c="white"
        radius="xl"
        size="xl"
      >
        <IconPlus onClick={onClick} style={{ cursor: "pointer" }} />
      </ActionIcon>
    </Affix>
  );
}
