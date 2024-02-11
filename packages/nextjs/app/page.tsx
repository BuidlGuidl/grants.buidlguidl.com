import Image from "next/image";

const Home = () => {
  return (
    <>
      {/* Hero section */}
      <div>
        <div className="container max-w-[90%] lg:max-w-6xl m-auto py-10 lg:py-16 xl:pl-18 lg:pl-8 flex flex-col-reverse lg:flex-row items-center justify-between gap-5 lg:gap-0">
          <div className="space-y-6 lg:max-w-[60%] flex flex-col items-center lg:items-start">
            <div className="relative">
              <h2 className="text-2xl lg:text-4xl xl:text-5xl text-center lg:text-left">
                Funding meaningful projects <br /> across the ecosystem
              </h2>
              <Image
                className="absolute -top-3 -right-7"
                src="/assets/sparkle.png"
                alt="sparkle"
                width={32}
                height={32}
              />
            </div>
            <div className="text-center px-1 max-w-lg lg:max-w-none lg:w-3/5 lg:px-0 lg:text-left space-y-5">
              <p className="m-0">
                Our micro grants are one of many ways BuidlGuidl funds development and contribute to Ethereum. Did you
                just finished SRE or completed one of our batches? This could be your next step in BuidlGuidl’s journey.
              </p>
              <button className="btn bg-base-100 btn-md h-14 px-16 font-medium">Learn More</button>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="max-w-md lg:max-w-none">
              <Image src="/assets/bg-universe.png" alt="developers list" width={500} height={500} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
