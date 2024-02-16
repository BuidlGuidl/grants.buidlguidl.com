import { CompletedGrants } from "./_components/CompletedGrants";
import { GrantsStats } from "./_components/GrantsStats";
import { HomepageHero } from "./_components/HomepageHero";

const Home = () => {
  return (
    <>
      <HomepageHero />
      <GrantsStats />
      <CompletedGrants />
    </>
  );
};

export default Home;
