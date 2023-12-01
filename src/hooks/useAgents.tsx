import { useQuery } from "react-query";

import { Keychain, ValidNetwork } from "@daohaus/keychain-utils";
import { EthAddress, createViemClient } from "@daohaus/utils";
import AgentsAbi from "../abis/AgentsNFT.json";
import { TARGET_DAO } from "../targetDao";

export type AgentSync = {
  amount: string;
  date: string;
  invalid: boolean;
  owner: `0x${string}`;
};

export type TokenIdInfo = {
  tokenId: string;
  firstSync: AgentSync;
  imageHash: string;
  lastSync: AgentSync;
  TBA: `0x${string}`;
  tbaBalance: string;
};

const fetchAgents = async ({
  chainId,
  ownerAddress,
  rpcs,
}: {
  chainId?: ValidNetwork;
  ownerAddress?: EthAddress;
  rpcs?: Keychain;
}) => {
  if (!chainId) {
    throw new Error("Missing Args");
  }
  const client = createViemClient({
    chainId,
    rpcs,
  });
  try {
    let supply, tokenIds;
    if (ownerAddress) {
      supply = await client.readContract({
        abi: AgentsAbi,
        address: TARGET_DAO.NFT_ADDRESS,
        functionName: "balanceOf",
        args: [ownerAddress],
      });

      const tokenIdPromises = [];
      for (let i = 0; i < parseInt(supply as string); i++) {
        tokenIdPromises.push(
          client.readContract({
            abi: AgentsAbi,
            address: TARGET_DAO.NFT_ADDRESS,
            functionName: "tokenOfOwnerByIndex",
            args: [ownerAddress, i],
          })
        );
      }

      tokenIds = await Promise.all(tokenIdPromises);
    } else {
      supply = await client.readContract({
        abi: AgentsAbi,
        address: TARGET_DAO.NFT_ADDRESS,
        functionName: "totalSupply",
        args: [],
      });

      const tokenIdPromises = [];
      for (let i = 0; i < parseInt(supply as string); i++) {
        tokenIdPromises.push(
          client.readContract({
            abi: AgentsAbi,
            address: TARGET_DAO.NFT_ADDRESS,
            functionName: "tokenByIndex",
            args: [i],
          })
        );
      }

      tokenIds = await Promise.all(tokenIdPromises);
    }
    console.log("tokenIds", tokenIds);
    console.log("supply", supply);

    const firstSyncs = (await Promise.all(
      tokenIds.map((tokenId) =>
        client.readContract({
          abi: AgentsAbi,
          address: TARGET_DAO.NFT_ADDRESS,
          functionName: "getFirstSync",
          args: [tokenId],
        })
      )
    )) as AgentSync[];

    const imageHashes = (await Promise.all(
      tokenIds.map((tokenId) =>
        client.readContract({
          abi: AgentsAbi,
          address: TARGET_DAO.NFT_ADDRESS,
          functionName: "getImageHash",
          args: [tokenId],
        })
      )
    )) as string[];

    const lastSyncs = (await Promise.all(
      tokenIds.map((tokenId) =>
        client.readContract({
          abi: AgentsAbi,
          address: TARGET_DAO.NFT_ADDRESS,
          functionName: "getLastSync",
          args: [tokenId],
        })
      )
    )) as AgentSync[];

    const TBAs = (await Promise.all(
      tokenIds.map((tokenId) =>
        client.readContract({
          abi: AgentsAbi,
          address: TARGET_DAO.NFT_ADDRESS,
          functionName: "getTba",
          args: [tokenId],
        })
      )
    )) as `0x${string}`[];

    const TbaBalances = (await Promise.all(
      tokenIds.map((tokenId) =>
        client.readContract({
          abi: AgentsAbi,
          address: TARGET_DAO.NFT_ADDRESS,
          functionName: "getTbaBalance",
          args: [tokenId],
        })
      )
    )) as string[];

    


    const tokens: TokenIdInfo[] = tokenIds.map((tokenId, index) => ({
      tokenId: tokenId as string,
      firstSync: firstSyncs[index],
      imageHash: imageHashes[index],
      lastSync: lastSyncs[index],
      TBA: TBAs[index],
      tbaBalance: TbaBalances[index],
    }));

    return {
      supply,
      tokens
    };
  } catch (err) {
    console.log("Error", err);
    throw new Error("Error");
  }
};

export const useAgents = ({
  chainId,
  ownerAddress,
}: {
  chainId?: ValidNetwork;
  ownerAddress?: EthAddress;
}) => {
  if (!chainId) {
    throw new Error("Missing Args");
  }
  const { data, error, ...rest } = useQuery(
    [`agents`, { ownerAddress }],
    () => fetchAgents({ chainId, ownerAddress }),
    { enabled: !!chainId }
  );
  return { ...data, error, ...rest };
};
