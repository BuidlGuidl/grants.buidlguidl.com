// APPLICATIONS DISABLED - Uncomment below to re-enable
// import Form from "./_component/Form";
import Link from "next/link";
import { NextPage } from "next";

const SubmitGrant: NextPage = () => {
  // APPLICATIONS DISABLED - Replace this return block with the commented one below to re-enable
  return (
    <div className="flex bg-base-100 items-center flex-col flex-grow text-center pt-10 md:pt-4 px-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Applications Closed</h1>
      <p className="text-md mb-0 max-w-xl">
        Grant applications are currently closed. Please check back later for updates.
      </p>
      <Link href="/" className="btn btn-primary mt-6">
        Return Home
      </Link>
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
