// APPLICATIONS DISABLED - Uncomment below to re-enable
// import Form from "./_component/Form";
import Image from "next/image";
import Link from "next/link";
import { NextPage } from "next";

const SubmitGrant: NextPage = () => {
  // APPLICATIONS DISABLED - Replace this return block with the commented one below to re-enable
  return (
    <div className="flex bg-base-100 items-center flex-col flex-grow text-center pt-10 md:pt-16 px-6">
      {/* Visual illustration with patches */}
      <div className="relative w-64 h-48 md:w-80 md:h-56 mb-8">
        <div className="absolute -rotate-12 left-0 top-4 h-[100px] w-[100px] md:h-[140px] md:w-[140px]">
          <Image src="/assets/blue-patch.png" alt="Decorative patch" fill className="opacity-60" />
        </div>
        <div className="absolute rotate-6 right-0 top-0 h-[90px] w-[90px] md:h-[130px] md:w-[130px]">
          <Image src="/assets/orange-patch.png" alt="Decorative patch" fill className="opacity-60" />
        </div>
        <div className="absolute -rotate-3 left-1/4 bottom-0 h-[80px] w-[80px] md:h-[110px] md:w-[110px]">
          <Image src="/assets/gray-patch.png" alt="Decorative patch" fill className="opacity-70" />
        </div>
        {/* Paused icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-12 h-12 md:w-16 md:h-16 text-gray-600"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Title with sparkle */}
      <div className="relative">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-ppEditorial mb-4">Applications Paused</h1>
        <Image
          className="absolute -top-2 -right-5 md:-top-3 md:-right-7"
          src="/assets/sparkle.png"
          alt="sparkle"
          width={28}
          height={28}
        />
      </div>

      <p className="text-md mb-0 max-w-xl text-gray-600 font-spaceMono">
        Grant applications are currently closed. We&apos;re preparing for the next round of grants.
        <br />
        Check back soon for updates!
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link
          href="/"
          className="btn btn-primary btn-md border-1 border-black hover:border-black rounded-2xl px-8 font-medium shadow-none"
        >
          Return Home
        </Link>
        <Link
          href="/#communityGrants"
          className="btn btn-outline btn-md border-1 border-black hover:border-black rounded-2xl px-8 font-medium shadow-none"
        >
          Learn About Grants
        </Link>
      </div>
    </div>
  );

  // ORIGINAL CODE - Uncomment to re-enable applications:
  // return (
  //   <div className="flex bg-base-100 items-center flex-col flex-grow text-center pt-10 md:pt-4 px-6">
  //     <h1 className="text-3xl sm:text-4xl font-bold mb-4">Apply for a Community Grant</h1>
  //     <p className="text-md mb-0 max-w-xl">
  //       Our focus with these grants is primarily on code-based initiatives. Community events, workshops and other
  //       speaking engagements will be rejected unless your suggestion is especially unique and compelling.
  //     </p>
  //     <p className="text-md pb-6 max-w-xl">We are excited to support your projects to drive the community forward.</p>
  //     <Form />
  //   </div>
  // );
};

export default SubmitGrant;
