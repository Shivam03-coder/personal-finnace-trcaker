import React from "react";
import DataTable from "./data-table";
import data from "@/data/index.json";

const page = () => {
  return <DataTable data={data} />;
};

export default page;
