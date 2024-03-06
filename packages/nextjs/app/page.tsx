import { ActiveGrants } from "./_components/ActiveGrants";
import { CommunityGrant } from "./_components/CommunityGrant";
import { CompletedGrants } from "./_components/CompletedGrants";
import { EcosystemGrants } from "./_components/EcosystemGrants";
import { GrantsStats } from "./_components/GrantsStats";
import { HomepageHero } from "./_components/HomepageHero";

export const revalidate = 21600; // 6 hours

const Home = () => {
  return (
    <>
      <HomepageHero />
      <GrantsStats />
      <EcosystemGrants />
      <CommunityGrant />
      <CompletedGrants limit={8} />
      <ActiveGrants />
    </>
  );
};

export default Home;
