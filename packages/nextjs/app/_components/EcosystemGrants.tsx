import Image from "next/image";

const EcosystemGrantsCard = ({
  title,
  description,
  imageLink,
  amountGranted,
}: {
  title: string;
  description: string;
  imageLink: string;
  amountGranted: string;
}) => {
  return (
    <div className="bg-base-100 rounded-2xl min-h-[380px] max-w-[370px] flex flex-col">
      <div className="h-56 w-full bg-gray-400/60 rounded-tl-2xl rounded-tr-2xl relative">
        <Image src={imageLink} alt={title} layout="fill" objectFit="cover" className="rounded-tl-2xl rounded-tr-2xl" />
        <p className="m-0 absolute bottom-4 left-4 text-4xl font-ppEditorial">{title}</p>
      </div>
      <div className="flex-1 flex flex-col items-start justify-between space-y-4 p-4 border-2 border-green-300">
        <p className="text-base m-0 font-spaceMono font-normal leading-5">
          {description ||
            "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.Lorem ipsum dolor sit amet, qui minim labore adipisicing."}
        </p>
        <div className="bg-primary rounded-lg py-1 px-2 text-xs font-bold">
          Amount:
          <span className="text-sm"> {amountGranted}</span>
        </div>
      </div>
    </div>
  );
};

export const EcosystemGrants = () => {
  return (
    <div>
      <div className="container flex flex-col justify-center max-w-[90%] lg:max-w-7xl mx-auto py-12 lg:px-4 gap-8 border-2 border-blue-300">
        <div className="self-center md:self-start w-fit relative">
          <h2 className="text-3xl md:text-4xl lg:text-6xl text-center lg:text-left font-ppEditorial">
            Ecosystem impact grants
          </h2>
          <Image className="absolute -top-3 -right-7" src="/assets/sparkle.png" alt="sparkle" width={32} height={32} />
        </div>

        <div className="flex flex-col items-center md:flex-row md:justify-center md:items-stretch gap-8 border-2 border-red-300">
          {/* Jessy's Hacker House */}
          <EcosystemGrantsCard
            title="Jessy's Hacker House"
            description=""
            imageLink="/assets/jessy-hacker-house.png"
            amountGranted="1 ETH"
          />
          {/* Solidty By Example */}
          <EcosystemGrantsCard
            title="Solidity By Example"
            description=""
            imageLink="/assets/solidity-by-example.png"
            amountGranted="1 ETH"
          />
          {/* Winter */}
          <EcosystemGrantsCard
            title="W1nt3r"
            description="Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet."
            imageLink="/assets/winter.png"
            amountGranted="1 ETH"
          />
        </div>
      </div>
    </div>
  );
};
