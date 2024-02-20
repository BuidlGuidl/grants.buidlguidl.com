import Image from "next/image";
import Link from "next/link";

export const CommunityGrant = () => {
  return (
    <div className="bg-secondary">
      <div className="container max-w-[90%] lg:max-w-7xl m-auto py-10 lg:py-16 xl:pl-18 lg:pl-8 flex flex-col-reverse lg:flex-row items-center justify-between gap-5 lg:gap-0 border-red-300 border-2">
        {/* Left section(Title, desc and btn) */}
        <div className="space-y-2 lg:max-w-[40%] flex flex-col items-center lg:items-start border-blue-300 border-2">
          {/* Title  */}
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-5xl text-center lg:text-left font-ppEditorial">BuidlGuidl</h2>
            <div className="relative">
              <h2 className="text-2xl md:text-3xl lg:text-5xl text-center lg:text-left font-ppEditorial">
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
          <div className="text-center font-spaceMono px-1 max-w-lg lg:max-w-none lg:w-11/12 lg:px-0 lg:text-left space-y-5">
            <p className="m-0 text-xs md:text-sm lg:text-lg">
              Have you just joined BG or finished one of our batches, and want to build something to improve the
              ecosystem? BuidlGuidl can sponsor up to 1 ETH to build your idea.
            </p>
            <Link
              href="/apply"
              className="btn bg-white hover:opacity-90 hover:bg-white btn-md border-1 border-black hover:border-1 hover:border-black rounded-2xl px-6 shadow-none"
            >
              Apply for communtiy grant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
