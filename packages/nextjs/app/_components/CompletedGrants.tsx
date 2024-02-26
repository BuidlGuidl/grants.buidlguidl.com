import Image from "next/image";
import { Address } from "~~/components/scaffold-eth";
import { getAllCompletedGrants } from "~~/services/database/grants";
import { GrantData } from "~~/services/database/schema";

const CompletedGrantCard = ({ title, description, askAmount, builder }: GrantData) => {
  return (
    <div className="w-72 md:w-[295px] bg-primary min-h-full rounded-2xl overflow-hidden shadow-lg p-4 space-y-4">
      <div className="h-44 w-full bg-secondary rounded-xl relative">
        <div className="badge bg-base-200 absolute top-4 right-4 rounded-2xl py-3 px-3">Learn more</div>
        <p className="m-0 absolute bottom-4 left-4 text-lg">{title}</p>
      </div>
      <div className="flex flex-col gap-2 px-3">
        <Address address={builder} />
        <p className="text-base m-0 mt-2">
          Amount granted: <span className="font-medium"> {askAmount} ETH</span>
        </p>
        <p className="text-base m-0 line-clamp-3 hover:line-clamp-none">{description}</p>
      </div>
    </div>
  );
};
export const CompletedGrants = async () => {
  const completedGrants = await getAllCompletedGrants();

  return (
    <div className="bg-base-100">
      <div className="container flex flex-col justify-center max-w-[95%] lg:max-w-7xl mx-auto py-12 gap-4">
        <div className="self-center lg:self-start w-fit relative">
          <h2 className="text-4xl lg:text-6xl text-center lg:text-left font-ppEditorial">Completed grants</h2>
          <Image className="absolute -top-3 -right-7" src="/assets/sparkle.png" alt="sparkle" width={32} height={32} />
        </div>
        <div className="flex flex-col items-center justify-center md:flex-row md:flex-wrap md:items-start gap-8">
          {completedGrants.map(grant => (
            <CompletedGrantCard key={grant.id} {...grant} />
          ))}
        </div>
      </div>
    </div>
  );
};
