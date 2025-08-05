import Image from "next/image";
import { ApplyEligibilityLink } from "./ApplyEligibilityLink";

export const CommunityGrant = () => {
  return (
    <div id="communityGrants" className="bg-secondary">
      <div className="container max-w-[90%] sm:max-w-md lg:max-w-[90%] xl:max-w-7xl m-auto xl:pl-4 lg:pt-10 flex flex-col-reverse lg:flex-row gap-5 lg:gap-0 my-6 lg:my-0">
        {/* Left section(Title, desc and btn) */}
        <div className="my-4 lg:py-16 space-y-2 lg:max-w-[45%] flex flex-col items-center lg:items-start">
          {/* Title  */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-center lg:text-left font-ppEditorial mb-0 lg:mb-2">
              BuidlGuidl
            </h2>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-center lg:text-left font-ppEditorial">
                Community Grants
              </h2>
              <Image
                className="absolute -top-3 -right-7"
                src="/assets/sparkle.png"
                alt="sparkle"
                width={32}
                height={32}
              />
            </div>
          </div>
          {/* Description */}
          <div className="text-center font-spaceMono px-1 max-w-xs sm:max-w-lg lg:max-w-none lg:w-11/12 lg:px-0 lg:text-left space-y-5">
            <p className="m-0 text-xs md:text-sm lg:text-base">
              Are you a BG member eager to make an impact in the ecosystem? At BuidlGuidl, we&apos;re excited to support
              your builds. We offer sponsorships starting at 0.08 ETH for projects that drive the community forward.
            </p>
            <ApplyEligibilityLink />
          </div>
        </div>
        {/* Right section (Who, process, payment, etc) */}
        <div className="relative w-full h-44 lg:h-auto lg:overflow-hidden">
          <div className="absolute rotate-6 h-[150px] w-[150px] lg:h-[370px] lg:w-[370px] top-4">
            <Image src="/assets/blue-patch.png" alt="Who section background" fill className="w-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center lg:space-y-2">
              <h2 className="font-extrabold text-xs lg:text-lg">WHO</h2>
              <p className="my-0 text-[0.4rem] lg:text-sm font-medium">
                Individuals from BuidlGuidl who want to build a project that contributes to the Ethereum ecosystem.
              </p>
            </div>
          </div>
          <div className="absolute h-[100px] w-[115px] lg:h-[250px] lg:w-[275px] -bottom-3 left-1/3 lg:-bottom-6 z-10 lg:z-0 lg:left-[30%]">
            <Image src="/assets/orange-patch.png" alt="Who section background" fill className="w-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center lg:space-y-2">
              <h2 className="font-extrabold text-xs lg:text-lg">Payment</h2>
              <p className="my-0 text-[0.4rem] lg:text-sm font-medium">
                50% upfront when your application is approved and 50% at project completion.
              </p>
            </div>
          </div>
          <div className="absolute -rotate-6 h-[130px] w-[140px] lg:h-[300px] lg:w-[300px] top-2 right-0 lg:top-6 lg:right-6">
            <Image src="/assets/green-patch.png" alt="Who section background" fill className="w-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center lg:space-y-2">
              <h2 className="font-extrabold text-xs lg:text-lg">Process</h2>
              <p className="my-0 text-[0.4rem] lg:text-sm font-medium">
                Fill out your application, get approved from the BG Grants team, and submit the project once completed.
              </p>
            </div>
          </div>
          <div className="absolute rotate-6 h-[70px] w-[70px] lg:h-[200px] lg:w-[200px] -bottom-2 lg:bottom-4 right-3 lg:right-0">
            <Image src="/assets/gray-patch.png" alt="Who section background" fill className="w-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center lg:space-y-2">
              <h2 className="font-extrabold text-xs lg:text-lg">Amount</h2>
              <p className="my-0 text-[0.4rem] lg:text-sm font-medium">Starting at 0.08 ETH</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
