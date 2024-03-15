import Image from "next/image";
import { getAllEcosystemGrants } from "~~/services/database/grants";

const EcosystemGrantsCard = ({
  title,
  description,
  imageLink,
  amountGranted,
  twitterLink,
}: {
  title: string;
  description: string;
  imageLink: string;
  amountGranted: string;
  twitterLink: string;
}) => {
  return (
    <div className="bg-base-100 rounded-2xl min-h-[380px] max-w-[370px] flex flex-col">
      <div className="h-56 w-full bg-gray-400/60 rounded-tl-2xl rounded-tr-2xl relative">
        <Image src={imageLink} alt={title} fill={true} className="rounded-tl-2xl rounded-tr-2xl" />
        <p className="m-0 absolute bottom-4 left-4 text-2xl md:text-3xl lg:text-4xl font-ppEditorial">{title}</p>
      </div>
      <div className="flex-1 flex flex-col items-start justify-between space-y-4 p-5">
        <p className="text-sm m-0 font-spaceMono font-normal leading-5 pb-2">{description}</p>
        <div className="flex justify-between items-baseline w-full">
          <div className="bg-primary rounded-lg py-1 px-2 text-xs font-bold">
            Amount:
            <span className="text-sm"> {Number(amountGranted).toFixed(2)} ETH</span>
          </div>
          <a href={twitterLink} target="_blank" className="text-sm underline underline-offset-1">
            Twitter
          </a>
        </div>
      </div>
    </div>
  );
};

export const EcosystemGrants = async () => {
  const ecosystemGrants = await getAllEcosystemGrants();
  return (
    <div>
      <div className="container flex flex-col justify-center max-w-[90%] lg:max-w-7xl mx-auto py-12 lg:pt-20 lg:pb-28 lg:px-4 gap-6">
        <div className="self-center lg:self-start w-fit relative">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-center lg:text-left font-ppEditorial">
            Ecosystem impact grants
          </h2>
          <Image className="absolute -top-3 -right-7" src="/assets/sparkle.png" alt="sparkle" width={32} height={32} />
        </div>

        <div className="flex flex-col flex-wrap items-center md:flex-row md:justify-center md:items-stretch gap-8 px-4 lg:px-0">
          {ecosystemGrants.grants.map((grant, index) => (
            <EcosystemGrantsCard
              key={`${grant.name}_${index}`}
              title={grant.name}
              description={grant.description}
              imageLink={grant.imgLink}
              amountGranted={grant.amountGranted}
              twitterLink={grant.twitterLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
