import SIWE from "~~/components/SIWE";
import { listCollections } from "~~/services/database/collections";

// revalidate the data at most every hour (just testing)
export const revalidate = 3600;

const Home = async () => {
  // This happens on the server
  const collections = await listCollections();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">grants.buidlguidl.com</span>
          </h1>
          <h2 className="font-bold">Collections:</h2>
          <ul>
            {collections.map(collection => (
              <li key={collection.id}>{collection.id}</li>
            ))}
          </ul>
          <h2 className="font-bold mt-8">SIWE:</h2>
          <div>
            <SIWE />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
