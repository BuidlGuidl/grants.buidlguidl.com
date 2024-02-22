"use client";

import { GrantReview } from "./_components/GrantReview";
import useSWR from "swr";
import { GrantDataWithBuilder } from "~~/services/database/schema";
import { PROPOSAL_STATUS } from "~~/utils/grants";
import { notification } from "~~/utils/scaffold-eth";

// ToDo. "Protect" with address header or PROTECT with signing the read.
const AdminPage = () => {
  // TODO: Move the response type to a shared location
  const { data, isLoading } = useSWR<{ data: GrantDataWithBuilder[] }>("/api/grants/review", {
    onError: error => {
      console.error("Error fetching grants", error);
      notification.error("Error getting grants data");
    },
  });
  const grants = data?.data;

  const completedGrants = grants?.filter(grant => grant.status === PROPOSAL_STATUS.SUBMITTED);
  const newGrants = grants?.filter(grant => grant.status === PROPOSAL_STATUS.PROPOSED);

  return (
    <div className="container mx-auto max-w-screen-md mt-12">
      <h1 className="text-4xl font-bold">Admin page</h1>
      {isLoading && <span className="loading loading-spinner"></span>}
      {grants && (
        <>
          <h2 className="font-bold mt-8">Proposals submitted as completed:</h2>
          {completedGrants?.length === 0 && <p>No completed grants</p>}
          {completedGrants?.map(grant => (
            <GrantReview key={grant.id} grant={grant} />
          ))}
          <h2 className="font-bold mt-8">New grant proposal:</h2>
          {newGrants?.length === 0 && <p>No new grants</p>}
          {newGrants?.map(grant => (
            <GrantReview key={grant.id} grant={grant} />
          ))}
        </>
      )}
    </div>
  );
};

export default AdminPage;
