"use client";

import { useEffect, useState } from "react";
import { useReadLocalStorage } from "usehooks-ts";
import { useAccount } from "wagmi";
import SIWE from "~~/components/SIWE";
import { GrantData } from "~~/services/database/schema";
import { notification } from "~~/utils/scaffold-eth";

const AdminPage = () => {
  const [grants, setGrants] = useState<GrantData[]>([]);
  const { isConnected } = useAccount();
  const jwt = useReadLocalStorage("jwt");

  // In use effect, make get request (with JWT) to /api/grants/all
  useEffect(() => {
    const getGrants = async () => {
      try {
        const response = await fetch("/api/grants/all", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const grants: GrantData[] = (await response.json()).data;
        setGrants(grants);
      } catch (error) {
        notification.error("Error getting grants");
      }
    };

    if (jwt) getGrants();
  }, [jwt]);

  return (
    <div className="container mx-auto max-w-screen-md mt-12">
      <h1 className="text-4xl font-bold">Admin page</h1>
      <SIWE />
      <h2 className="font-bold mt-8">Admin data:</h2>
      {!isConnected || !jwt ? (
        <p>Connect & authenticate to see admin data</p>
      ) : (
        <>
          <h2 className="font-bold mt-8">All grants:</h2>
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
