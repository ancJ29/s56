import { User } from "@/common/services/users";
import { SimpleResponsiveTable } from "@/common/ui-components/Table/SimpleResponsiveTable";
import { useViewportSize } from "@mantine/hooks";
import { useState } from "react";
import { configs } from "./config";

export default function Users() {
  const { height } = useViewportSize();
  const [users] = useState<User[]>([]);
  // useEffect(() => {
  //   getUsers().then((users) => {
  //     setUsers(users);
  //   });
  // }, []);

  return (
    <>
      <SimpleResponsiveTable
        scrollAreaHeight={height * 0.9}
        tableData={{ configs, data: users }}
      />
    </>
  );
}
