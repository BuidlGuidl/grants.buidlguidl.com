"use client";

import { useEffect, useState } from "react";
import { GrantData } from "~~/services/database/schema";
import { notification } from "~~/utils/scaffold-eth";

// ToDo. "Protect" with address header or PROTECT with signing the read.
const AdminPage = () => {
  const [grants, setGrants] = useState<GrantData[]>([]);

  useEffect(() => {
    const getGrants = async () => {
      try {
        const response = await fetch("/api/grants/review");
        const grants: GrantData[] = (await response.json()).data;
        setGrants(grants);
      } catch (error) {
        notification.error("Error getting grants for review");
      }
    };

    getGrants();
  }, []);

  return (
    <div className="container mx-auto max-w-screen-md mt-12">
      <h1 className="text-4xl font-bold">Admin page</h1>
      {grants && (
        <>
          <h2 className="font-bold mt-8">All grants that need review:</h2>
          {grants.map(grant => (
            <div key={grant.id} className="border p-4 my-4">
              <h3 className="font-bold">{grant.title}</h3>
              <p>{grant.description}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AdminPage;
