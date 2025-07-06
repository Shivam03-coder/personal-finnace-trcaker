import React from "react";
import AccountTable from "./account-table";

import accounts from "@/data/account.json";
import { HydrateClient } from "@/trpc/server";

const page = () => {
  return (
      <div className="page">
        <AccountTable />
      </div>
  );
};

export default page;
