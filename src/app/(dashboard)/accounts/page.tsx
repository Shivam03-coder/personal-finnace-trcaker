import React from "react";
import AccountTable from "./account-table";

import accounts from "@/data/account.json";

const page = () => {
  const parsedAccounts = accounts.map((account) => ({
    ...account,
    createdAt: new Date(account.createdAt),
  }));
  return (
    <div className="page">
      <AccountTable accounts={parsedAccounts} />
    </div>
  );
};

export default page;
