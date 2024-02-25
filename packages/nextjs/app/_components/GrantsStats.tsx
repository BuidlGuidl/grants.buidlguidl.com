import Image from "next/image";
import ecosystemGrants from "~~/services/database/ecosystemGrants.json";
import { getGrantsStats } from "~~/services/database/grants";

const Stat = ({ label, imgLink, value }: { label: string; imgLink: string; value: string | number }) => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-2 items-baseline">
        <Image src={imgLink} alt={label} width={45} height={50} className="mt-1" />
        <h2 className="text-4xl lg:text-6xl my-0 font-ppEditorial lg:leading-3">{value}</h2>
      </div>
      <p className="text-lg my-0">{label}</p>
    </div>
  );
};

export const GrantsStats = async () => {
  const stats = await getGrantsStats();

  const sum = ecosystemGrants.grants.reduce(
    (acc, grant) => acc + parseFloat(grant.amountGranted),
    stats.total_eth_granted,
  );
  const totalEthGranted = Number.isInteger(sum) ? sum : sum.toFixed(2);

  const totalGrants = ecosystemGrants.grants.length + stats.total_grants;

  return (
    <div className="bg-base-300">
      <div className="container flex flex-col items-center justify-center max-w-[90%] lg:max-w-7xl mx-auto py-12 lg:px-12 gap-6">
        <div className="flex flex-col gap-8 md:flex-row justify-between items-start lg:w-4/5">
          <Stat label="Total grants" imgLink="/assets/stats-total.png" value={totalGrants} />
          <Stat label="ETH granted" imgLink="/assets/stats-eth-granted.png" value={totalEthGranted} />
          <Stat label="Active grants" imgLink="/assets/stats-active.png" value={stats.total_active_grants} />
        </div>
      </div>
    </div>
  );
};
