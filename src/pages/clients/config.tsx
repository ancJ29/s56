export const configs = [
  {
    key: "position",
    field: "position",
    label: "Element position",
  },
  {
    key: "name",
    field: "name",
    label: "Element name",
  },
  {
    key: "symbol",
    field: "symbol",
    label: "Symbol",
  },
  {
    key: "mass",
    field: "mass",
    label: "Atomic mass",
  },
  {
    key: "action",
    label: "Action",
    render: () => {
      return <>Action</>;
    },
  },
];

export const data = [
  { position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
  { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
  { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium" },
  { position: 56, mass: 137.33, symbol: "Ba", name: "Barium" },
  { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium" },
];
