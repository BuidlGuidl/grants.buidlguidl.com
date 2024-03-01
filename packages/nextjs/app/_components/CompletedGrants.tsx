import Image from "next/image";
import { Address } from "~~/components/scaffold-eth";
import { getAllCompletedGrants } from "~~/services/database/grants";
import { GrantData } from "~~/services/database/schema";

const CompletedGrantCard = ({ title, description, askAmount, builder, link, completedAt }: GrantData) => {
  return (
    <div className="w-72 md:w-[300px] bg-primary min-h-full rounded-2xl overflow-hidden shadow-lg p-4 space-y-4">
      <div className="h-44 w-full bg-secondary rounded-xl relative">
        <a
          href={link}
          className="badge bg-base-200 absolute top-4 right-4 rounded-2xl py-3 px-3 hover:opacity-80"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more
        </a>
        {completedAt && (
          <p className="badge bg-base-200 absolute top-4 left-4 rounded-2xl m-0">
            {new Date(completedAt).toLocaleDateString()}
          </p>
        )}
        <p className="m-0 absolute bottom-4 left-4 text-lg">{title}</p>
      </div>
      <div className="flex flex-col gap-2 px-3">
        <Address address={builder} link={`https://app.buidlguidl.com/builders/${builder}`} />
        <p className="text-base m-0 mt-2">
          <span className="font-medium">{askAmount} ETH</span>
        </p>
        <p className="text-base m-0 line-clamp-3">{description}</p>
      </div>
    </div>
  );
};

export const CompletedGrants = async ({ reducedView = false }) => {
  const completedGrants = await getAllCompletedGrants();
  const grantsToShow = reducedView ? completedGrants.slice(0, 8) : completedGrants;

  return (
    <div className="bg-base-100">
      <div className="container flex flex-col justify-center max-w-[95%] lg:max-w-7xl mx-auto py-12 gap-4">
        <div className="self-center lg:self-start w-fit relative">
          <h2 className="text-4xl lg:text-6xl text-center lg:text-left font-ppEditorial">Completed grants</h2>
          <Image className="absolute -top-3 -right-7" src="/assets/sparkle.png" alt="sparkle" width={32} height={32} />
        </div>
        <div
          className={`${
            reducedView ? "grant-container-rwd" : ""
          } flex flex-col items-center justify-center md:flex-row md:flex-wrap md:items-start gap-6`}
        >
          {grantsToShow.map(grant => (
            <CompletedGrantCard key={grant.id} {...grant} />
          ))}
        </div>
        {reducedView && (
          <div className="link w-full text-center mt-8 text-lg lg:text-xl">
            <a href="/completed-grants" className="">
              See all completed grants ({completedGrants.length})
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
