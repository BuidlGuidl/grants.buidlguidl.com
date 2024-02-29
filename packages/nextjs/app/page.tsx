import { ActiveGrants } from "./_components/ActiveGrants";
import { CommunityGrant } from "./_components/CommunityGrant";
import { CompletedGrants } from "./_components/CompletedGrants";
import { EcosystemGrants } from "./_components/EcosystemGrants";
import { GrantsStats } from "./_components/GrantsStats";
import { HomepageHero } from "./_components/HomepageHero";

const Home = () => {
  return (
    <>
      <HomepageHero />
      <GrantsStats />
      <EcosystemGrants />
      <CommunityGrant />
      <CompletedGrants view="reduced" />
      <ActiveGrants />
    </>
  );
};

export default Home;
