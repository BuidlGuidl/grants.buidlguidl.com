import Image from "next/image";
import { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";
import { getAllActiveGrants } from "~~/services/database/grants";
import { GrantData } from "~~/services/database/schema";
import { formatDateFromNow } from "~~/utils/grants";

export const dynamic = "force-dynamic";

const ActiveGrantCard = ({ title, description, askAmount, builder, approvedAt }: GrantData) => {
  return (
    <div className="w-72 md:w-[290px] bg-primary min-h-full rounded-2xl overflow-hidden shadow-lg">
      <div className="flex justify-between items-center bg-white py-3 px-4 text-sm">
        <div className="flex items-center">
          <Image src="/assets/eth-completed-grant.png" alt="ETH Icon" width={10} height={10} />
          <span className="ml-1 font-bold">{askAmount} ETH</span>
        </div>
        <span>{approvedAt ? formatDateFromNow(approvedAt) : "-"}</span>
      </div>
      <div className="bg-base-300 p-4 flex items-center justify-start h-[6rem]">
        <p className="text-xl m-0 line-clamp-2">{title}</p>
      </div>
      <div className="flex flex-col p-5 gap-4 bg-white">
        <div className="text-left">
          <Address address={builder} link={`https://app.buidlguidl.com/builders/${builder}`} />
        </div>
        <div className="text-left flex-1">
          <p className="m-0 line-clamp-3 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

const ActiveGrantsPage: NextPage = async () => {
  const activeGrants = await getAllActiveGrants();
  if (!activeGrants.length) {
    return null;
  }

  // Sort by approved date DESC
  const sortedActiveGrants = activeGrants.sort((a, b) => {
    if (a.approvedAt && b.approvedAt) {
      return b.approvedAt - a.approvedAt;
    }
    return 0;
  });

  return (
    <div className="bg-customBlue">
      <div className="container flex flex-col justify-center max-w-[90%] xl:max-w-7xl mx-auto py-12 lg:pt-20 lg:pb-28 gap-6 xl:px-4">
        <div className="self-center lg:self-start w-fit relative">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-center lg:text-left font-ppEditorial">Active grants</h2>
          <Image className="absolute -top-3 -right-7" src="/assets/sparkle.png" alt="sparkle" width={32} height={32} />
        </div>
        <div className={`flex flex-col items-center justify-center md:flex-row md:flex-wrap md:items-start gap-6`}>
          {sortedActiveGrants.map(grant => (
            <ActiveGrantCard key={grant.id} {...grant} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default ActiveGrantsPage;
