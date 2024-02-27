import Image from "next/image";
import { Address } from "~~/components/scaffold-eth";
import { getAllActiveGrants } from "~~/services/database/grants";
import { GrantData } from "~~/services/database/schema";
import { formatDateFromNow } from "~~/utils/grants";

const ActiveGrantRow = ({ title, askAmount, builder, approvedAt }: GrantData) => {
  return (
    <tr className="border-b border-black p-10 text-base">
      <td className="p-4 pl-4">{title}</td>
      <td className="p-4 pl-4">{askAmount} ETH</td>
      <td className="p-4 pl-4">
        <Address address={builder} />
      </td>
      <td className="p-4 pl-4">{approvedAt ? formatDateFromNow(approvedAt) : "-"}</td>
    </tr>
  );
};

export const ActiveGrants = async () => {
  const activeGrants = await getAllActiveGrants();

  if (!activeGrants.length) {
    return null;
  }

  return (
    <div className="container flex flex-col justify-center max-w-[90%] xl:max-w-7xl mx-auto py-16 gap-4">
      <div className="self-center lg:self-start w-fit relative">
        <h2 className="text-4xl lg:text-6xl text-center lg:text-left font-ppEditorial">WIP grants</h2>
        <Image className="absolute -top-3 -right-7" src="/assets/sparkle.png" alt="sparkle" width={32} height={32} />
      </div>
      <div className="bg-base-100 rounded-3xl px-2 sm:px-6 pt-2 pb-6">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="border-b border-black text-black text-base">
                <th>Title</th>
                <th>Funding</th>
                <th>Builder</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className="">
              {activeGrants.map(grant => (
                <ActiveGrantRow key={grant.id} {...grant} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
