import Image from "next/image";
import ecosystemGrants from "~~/services/database/ecosystemGrants.json";
import { getGrantsStats } from "~~/services/database/grants";

export const GrantsStats = async () => {
  const stats = await getGrantsStats();

  const totalEthGranted = ecosystemGrants.grants.reduce(
    (acc, grant) => acc + parseFloat(grant.amountGranted),
    stats.total_eth_granted,
  );
  const totalGrants = ecosystemGrants.grants.length + stats.total_grants;

  return (
    <div className="bg-base-300">
      <div className="container flex flex-col items-center justify-center max-w-[90%] lg:max-w-7xl mx-auto py-12 lg:px-12 gap-6">
        <div className="flex flex-col gap-8 md:flex-row justify-between items-start lg:w-4/5">
          <div className="flex flex-col items-center">
            <div className="flex gap-3 items-start">
              <Image src="/assets/sparkle.png" alt="diamon icon" width={40} height={40} className="mt-1" />
              <h2 className="text-4xl lg:text-6xl my-0 font-ppEditorial">{totalGrants}</h2>
            </div>
            <p className="text-lg my-0">Total Grants</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex gap-3 items-start">
              <Image src="/assets/sparkle.png" alt="diamon icon" width={40} height={40} className="mt-1" />
              <h2 className="text-4xl lg:text-6xl my-0 font-ppEditorial">{totalEthGranted}</h2>
            </div>
            <p className="text-lg my-0">ETH Granted</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex gap-3 items-start">
              <Image src="/assets/sparkle.png" alt="diamon icon" width={40} height={40} className="mt-1" />
              <h2 className="text-4xl lg:text-6xl my-0 font-ppEditorial">{stats.total_active_grants}</h2>
            </div>
            <p className="text-lg my-0">Active Grants</p>
          </div>
        </div>
      </div>
    </div>
  );
};
