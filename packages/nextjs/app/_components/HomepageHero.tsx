import Image from "next/image";
import Link from "next/link";

export const HomepageHero = () => (
  <div className="container max-w-[90%] lg:max-w-7xl m-auto py-10 lg:py-16 xl:pl-18 lg:pl-8 flex flex-col-reverse lg:flex-row items-center justify-between gap-5 lg:gap-0">
    <div className="space-y-2 lg:max-w-[65%] flex flex-col items-center lg:items-start">
      <div className="relative">
        <h2 className="text-3xl md:text-4xl lg:text-6xl lg:leading-[1.2] text-center lg:text-left font-ppEditorial">
          Funding meaningful projects <br /> across the ecosystem
        </h2>
        <Image className="absolute -top-3 -right-7" src="/assets/sparkle.png" alt="sparkle" width={32} height={32} />
      </div>
      <div className="text-center font-spaceMono px-1 max-w-lg lg:max-w-none lg:w-4/5 lg:px-0 lg:text-left space-y-5">
        <p className="m-0 text-xs md:text-sm lg:text-lg">
          BG grants are one of the ways BuidlGuidl funds development and contribute to the Ethereum ecosystem. Did you
          just finished SRE or completed one of our batches? This could be the next step in your BuidlGuidl’s journey.
        </p>
        <Link
          href="/apply"
          className="btn btn-primary btn-md border-1 border-black rounded-2xl px-14 font-medium shadow-none"
        >
          Learn More
        </Link>
      </div>
    </div>
    <div className="flex flex-col items-center">
      <div className="max-w-md lg:max-w-none">
        <Image src="/assets/bg-universe.png" alt="developers list" width={500} height={500} />
      </div>
    </div>
  </div>
);
