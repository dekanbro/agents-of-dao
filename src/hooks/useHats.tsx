import { useQuery } from "react-query";

import { ValidNetwork } from "@daohaus/keychain-utils";
import { handleErrorMessage } from "@daohaus/utils";
import {
  HatsSubgraphClient,
  WearerPropsConfig,
} from "@hatsprotocol/sdk-v1-subgraph";

const fetchHats = async ({
  chainId,
  wearerAddress,
}: {
  chainId: ValidNetwork;
  wearerAddress: `0x${string}`;
}) => {
    console.log("fetchHats", chainId, wearerAddress);
  const props: WearerPropsConfig = {
    currentHats: {
      // get the wearer's hats
      props: {
        status: true, // for each hat, include its status (active/inactive)
      },
    },
    mintEvent: {
      // get the wearer's hat minting events
      props: {
        blockNumber: true, // for each event, include its block number
      },
      filters: {
        first: 1, // fetch only the latest event
      },
    },
  };
  const hatsSubgraphClient = new HatsSubgraphClient({});
  
  try {
    const hats = await hatsSubgraphClient.getWearer({
      chainId: 5, // TODO: change to chainId convert to number
      wearerAddress,
      props,
    });

    const currentHatsPromise = [];
    for (const hat of hats.currentHats || []) {
        const hatId: bigint = BigInt(hat.id);
        const currentHatPromise = await hatsSubgraphClient.getHat({
            chainId: 5, //chainId,
            hatId,
            props: {
                maxSupply: true, // get the maximum amount of wearers for the hat
                prettyId: true, // get the hat's pretty ID
                imageUri: true, // get the hat's image URI
                details: true, // get the hat's details URI
                wearers: { // get the hat's wearers 
                  props: {
                    
                  }, // for each wearer, include only its ID (address)
                },
                events: { // get the hat's events
                  props: {
                    transactionID: true, // for each event, include the transaction ID
                  },
                  filters: {
                    first: 10, // fetch only the latest 10 events
                  },
                },
              },
        });
        currentHatsPromise.push(currentHatPromise);
    }
    const data = await Promise.all(currentHatsPromise);

    const detailPromises = [];
    for (const hat of data || []) {
        // fetch json from ipfs uri        
        const detailPromise = await fetch(`https://ipfs.io/ipfs/${hat.details?.split("//")[1]}`);
        if(!detailPromise.ok) {
            detailPromises.push({data: {name: " "}});
        } else {
            detailPromises.push(detailPromise.json());
        }
            
    }
    const details = await Promise.all(detailPromises);
    const hatsWithDetails = data.map((hat, index) => {
        return {
            ...hat,
            details: details[index],
        }
    });
    console.log("hatsWithDetails", hatsWithDetails);
    return hatsWithDetails;


  } catch (error) {
    console.error(error);
    throw new Error(
      handleErrorMessage({ error, fallback: "Error fetching records" })
    );
  }
};

export const useHats = ({
  chainId,
  wearerAddress,
}: {
  chainId: ValidNetwork;
  wearerAddress: `0x${string}`;
}) => {
  const { data, error, ...rest } = useQuery(
    [`${wearerAddress}_${chainId}`, { wearerAddress, chainId }],
    () =>
      fetchHats({
        chainId: chainId as ValidNetwork,
        wearerAddress,
      }),
    { enabled: !!wearerAddress && !!chainId }
  );

  return { hats: data, error: error as Error | null, ...rest };
};
