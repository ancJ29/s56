export const configs = [
  {
    key: "name",
    field: "name",
    label: "Task Name",
    styles: {
      tableTh: {
        minWidth: "20vw",
      },
    },
  },
  {
    key: "assignee",
    field: "assignee",
    label: "Assignee",
  },
  {
    key: "status",
    field: "status",
    label: "Status",
    styles: {
      tableTh: {
        minWidth: "10vw",
      },
    },
  },
  {
    key: "endDate",
    label: <span>Start Date 〜 End Date</span>,
    styles: {
      tableTh: {
        minWidth: "10vw",
      },
    },
    render(props: { startDate: string; endDate: string }) {
      return (
        <>
          {props.startDate}
          <br />
          〜
          <br />
          {props.endDate}
        </>
      );
    },
  },
];
