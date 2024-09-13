import useTranslation from "@/common/hooks/useTranslation";
import useAuthStore from "@/common/stores/auth";
import { TablerIcon } from "@/common/ui-components/TablerIcon";
import { IconLogout } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./style.module.css";

// https://ui.mantine.dev/category/navbars/#navbar-simple
export function SimpleNavbar() {
  const t = useTranslation();
  const { payload } = useAuthStore();
  const menu = payload?.client?.menu || [];
  const navigate = useNavigate();
  const [active, setActive] = useState(menu[0]?.label);
  const links = (payload?.client?.menu || []).map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
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
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <a href="/logout" className={classes.link}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>{t("Logout")}</span>
        </a>
      </div>
    </nav>
  );
}
