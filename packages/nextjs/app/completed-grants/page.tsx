import { CompletedGrants } from "../_components/CompletedGrants";
import { NextPage } from "next";

export const dynamic = "force-dynamic";

const CompletedGrantsPage: NextPage = () => {
  return <CompletedGrants />;
};

export default CompletedGrantsPage;
