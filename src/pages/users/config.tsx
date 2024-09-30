import { User } from "@/common/services/users";
import { Text } from "@mantine/core";

export const configs = [
  {
    key: "userName",
    field: "userName",
    label: "User name",
  },
  {
    key: "fullName",
    label: "Full name",
    render: (user: User) => {
      return (
        <Text style={{ whiteSpace: "pre-line" }}>
          {user.displayName || user.fullName || "N/A"}
        </Text>
      );
    },
  },
  {
    key: "department",
    label: "Department",
    field: "department",
  },
];
