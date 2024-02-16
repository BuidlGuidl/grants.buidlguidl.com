import { CompletedGrants } from "./_components/CompletedGrants";
import { GrantsStats } from "./_components/GrantsStats";
import { HomepageHero } from "./_components/HomepageHero";
import SIWE from "~~/components/SIWE";

const Home = () => {
  return (
    <>
      <HomepageHero />
      <GrantsStats />
      <CompletedGrants />
      <h2 className="font-bold mt-8">SIWE:</h2>
      <SIWE />
    </>
  );
};

export default Home;
