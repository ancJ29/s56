import useTranslation from "@/common/hooks/useTranslation";
import useAuthStore from "@/common/stores/auth";
import { TablerIcon } from "@/common/ui-components/TablerIcon";
import { Text, UnstyledButton } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./style.module.css";

// https://ui.mantine.dev/category/navbars/#navbar-simple
export function SimpleNavbar() {
  const t = useTranslation();
  const { payload } = useAuthStore();
  const navigate = useNavigate();
  const [active, setActive] = useState(
    payload?.permission?.menu?.[0]?.label,
  );
  const menu = useMemo(
    () => payload?.permission?.menu || [],
    [payload],
  );
  useEffect(() => {
    const { label } =
      menu.find((item) => item.link === window.location.pathname) ||
      {};
    setActive(label || menu[0]?.label);
  }, [menu]);

  const links =
    payload?.permission?.menu?.map((item) => (
      <Text
        className={classes.link}
        data-active={item.label === active || undefined}
        key={item.label}
        onClick={(event) => {
          event.preventDefault();
          setActive(item.label);
          navigate(item.link);
        }}
      >
        <TablerIcon
          iconName={item.icon}
          className={classes.linkIcon}
          stroke={1.5}
        />
        <span>{t(item.label)}</span>
      </Text>
    )) || [];

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <UnstyledButton
          className={classes.link}
          onClick={(e) => {
            e.preventDefault();
            useAuthStore.getState().logout({
              reload: true,
              to: "/login",
            });
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>{t("Logout")}</span>
        </UnstyledButton>
      </div>
    </nav>
  );
}
