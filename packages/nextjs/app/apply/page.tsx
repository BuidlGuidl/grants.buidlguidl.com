import Form from "./_component/Form";
import { NextPage } from "next";

const SubmitGrant: NextPage = () => {
  return (
    <div className="flex items-center flex-col flex-grow text-center pt-10 md:pt-4 px-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Apply for a Community Grant</h1>
      <p className="text-md mb-0 max-w-xl">
        As a BuidlGuidl member, you can build projects to make a significant impact on the ecosystem, and get
        sponsorship of up to 1 ETH for it.
      </p>
      <p className="text-md pb-6 max-w-xl">We are excited to support your projects to drive the community forward.</p>
      <Form />
    </div>
  );
};

export default SubmitGrant;
