import { APP_ICONS } from "@/configs/enums/icons";
import {
  Icon,
  Icon2fa,
  IconBellRinging,
  IconChecklist,
  IconDatabaseImport,
  IconFingerprint,
  IconKey,
  IconLogout,
  IconProps,
  IconReceipt2,
  IconSettings,
  IconUsersGroup,
} from "@tabler/icons-react";
import React, { useMemo } from "react";

const IconMap: Record<
  APP_ICONS,
  React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<Icon>
  >
> = {
  [APP_ICONS.IconChecklist]: IconChecklist,
  [APP_ICONS.IconUsersGroup]: IconUsersGroup,
  [APP_ICONS.Icon2fa]: Icon2fa,
  [APP_ICONS.IconBellRinging]: IconBellRinging,
  [APP_ICONS.IconDatabaseImport]: IconDatabaseImport,
  [APP_ICONS.IconFingerprint]: IconFingerprint,
  [APP_ICONS.IconKey]: IconKey,
  [APP_ICONS.IconLogout]: IconLogout,
  [APP_ICONS.IconReceipt2]: IconReceipt2,
  [APP_ICONS.IconSettings]: IconSettings,
};

export function TablerIcon({
  iconName,
  ...props
}: { iconName: APP_ICONS } & IconProps) {
  const Component = useMemo(() => IconMap[iconName], [iconName]);
  return Component ? <Component {...props} /> : <></>;
}
