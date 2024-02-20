import Image from "next/image";
import Link from "next/link";

export const CommunityGrant = () => {
  return (
    <div className="bg-secondary">
      <div className="container max-w-[90%] lg:max-w-7xl m-auto xl:pl-18 lg:pl-8 flex flex-col-reverse lg:flex-row gap-5 lg:gap-0 max-h-[30rem]">
        {/* Left section(Title, desc and btn) */}
        <div className="my-10 lg:py-16 space-y-2 lg:max-w-[40%] flex flex-col items-center lg:items-start">
          {/* Title  */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-center lg:text-left font-ppEditorial">BuidlGuidl</h2>
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
            <p className="m-0 text-xs md:text-sm lg:text-lg">
              Have you just joined BG or finished one of our batches, and want to build something to improve the
              ecosystem? BuidlGuidl can sponsor up to 1 ETH to build your idea.
            </p>
            <Link
              href="/apply"
              className="btn bg-white hover:opacity-90 hover:bg-white btn-md border-1 border-black hover:border-1 hover:border-black rounded-2xl px-6 shadow-none font-medium"
            >
              Apply for grant
            </Link>
          </div>
        </div>
        {/* Right section (Who, process, payment, etc) */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute rotate-6 h-[370px] w-[370px] top-4">
            <Image src="/assets/blue-patch.png" alt="Who section background" fill className="w-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-6">
              <h2 className="font-extrabold text-lg">WHO</h2>
              <p className="my-0 text-xs font-medium">
                Individuals or small teams from BuildGuidl, who want to start a project to contribute to the ecosystem
                and require some kind of sponsorship.
              </p>
            </div>
          </div>
          <div className="absolute h-[250px] w-[275px] -bottom-6 left-[30%]">
            <Image src="/assets/orange-patch.png" alt="Who section background" fill className="w-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-6">
              <h2 className="font-extrabold text-lg">Payment</h2>
              <p className="my-0 text-xs font-medium">
                50% upfront when your application is approved and 50% at grant completion.
              </p>
            </div>
          </div>
          <div className="absolute -rotate-6 h-[300px] w-[300px] top-6 right-6">
            <Image src="/assets/green-patch.png" alt="Who section background" fill className="w-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-6">
              <h2 className="font-extrabold text-lg">Process</h2>
              <p className="my-0 text-xs font-medium">
                Fill your application, the BG Grants team will evaluate it, approving or rejecting it, and will give you
                feedback about your application.
              </p>
            </div>
          </div>
          <div className="absolute rotate-6 h-[200px] w-[200px] bottom-4 right-0">
            <Image src="/assets/gray-patch.png" alt="Who section background" fill className="w-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-4">
              <h2 className="font-extrabold text-lg">Amount</h2>
              <p className="my-0 text-xs font-medium">Up to 1 ETH</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
