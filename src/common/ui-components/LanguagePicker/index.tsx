import { Language } from "@/configs/enums";
import { Menu, UnstyledButton } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";
import classes from "./style.module.css";

const current = localStorage.__LANGUAGE__ || Language.EN;

// cspell:ignore Tiếng Việt
const options = [
  {
    icon: "🇺🇸",
    label: "English",
    value: Language.EN,
    selected: current === Language.EN,
  },
  {
    icon: "🇻🇳",
    label: "Tiếng Việt",
    value: Language.VI,
    selected: current === Language.VI,
  },
];

const currentLanguage =
  options.find((item) => item.selected) || options[0];

export function LanguagePicker() {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(currentLanguage);

  const items = options.map((item) => (
    <Menu.Item
      onClick={() => {
        setSelected(item);
        localStorage.__LANGUAGE__ = item.value;
        setTimeout(() => {
          window.location.reload();
        }, 200);
      }}
      key={item.label}
    >
      <span>
        {item.icon}
        &nbsp;&nbsp;
        {item.label}
      </span>
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          className={classes.control}
          data-expanded={opened || undefined}
        >
          <span className={classes.label}>
            {selected.icon}
            &nbsp;&nbsp;
            {selected.label}
          </span>
          <IconChevronDown
            size="1rem"
            className={classes.icon}
            stroke={1.5}
          />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown miw={"10rem"}>{items}</Menu.Dropdown>
    </Menu>
  );
}
