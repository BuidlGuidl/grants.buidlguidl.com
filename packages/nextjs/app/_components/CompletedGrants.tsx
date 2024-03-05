import Image from "next/image";
import { Address } from "~~/components/scaffold-eth";
import { getAllCompletedGrants } from "~~/services/database/grants";
import { GrantData } from "~~/services/database/schema";

const CompletedGrantCard = ({ title, description, askAmount, builder, link, completedAt }: GrantData) => {
  return (
    <div className="w-72 md:w-[300px] bg-primary min-h-full rounded-2xl overflow-hidden shadow-lg">
      <div className="flex justify-between items-center bg-white p-2 text-sm">
        <div className="flex items-center px-1">
          <Image src="/assets/eth-completed-grant.png" alt="ETH Icon" width={10} height={10} />
          <span className="ml-1 font-bold">{askAmount} ETH</span>
        </div>
        <span>{completedAt ? new Date(completedAt).toLocaleDateString() : ""}</span>
      </div>
      <div className="bg-base-300 p-4 flex items-center justify-start h-[6rem]">
        <p className="text-2xl m-0 line-clamp-2">{title}</p>
      </div>
      <div className="flex flex-col p-4 gap-4 bg-white">
        <div className="text-left">
          <Address address={builder} link={`https://app.buidlguidl.com/builders/${builder}`} />
        </div>
        <div className="text-left flex-1">
          <p className="m-0 line-clamp-3">{description}</p>
        </div>
        <div className="text-left mt-auto">
          <a
            href={link}
            className="badge bg-primary rounded-2xl py-4 px-5 hover:opacity-80 mt-2"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn more
          </a>
        </div>
      </div>
    </div>
  );
};

export const CompletedGrants = async ({ limit }: { limit?: number }) => {
  const completedGrants = await getAllCompletedGrants(limit);

  return (
    <div className="bg-customBlue">
      <div className="container flex flex-col justify-center max-w-[95%] lg:max-w-7xl mx-auto py-12 gap-4">
        <div className="self-center lg:self-start w-fit relative">
          <h2 className="text-4xl lg:text-6xl text-center lg:text-left font-ppEditorial">Completed grants</h2>
          <Image className="absolute -top-3 -right-7" src="/assets/sparkle.png" alt="sparkle" width={32} height={32} />
        </div>
        <div
          className={`${
            limit ? "grant-container-rwd" : ""
          } flex flex-col items-center justify-center md:flex-row md:flex-wrap md:items-start gap-6`}
        >
          {completedGrants.map(grant => (
            <CompletedGrantCard key={grant.id} {...grant} />
          ))}
        </div>
        {limit && (
          <div className="link w-full text-center mt-8 text-lg lg:text-xl">
            <a href="/completed-grants" className="">
              See all completed grants
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
