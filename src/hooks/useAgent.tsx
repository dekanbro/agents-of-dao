import { useQuery } from "react-query";

import { Keychain, ValidNetwork } from "@daohaus/keychain-utils";
import { createViemClient } from "@daohaus/utils";
import AgentsAbi from "../abis/AgentsNFT.json";
import { TARGET_DAO } from "../targetDao";
import { AgentSync } from "./useAgents";

const fetchAgent = async ({
  chainId,
  agentId,
  rpcs,
}: {
  chainId?: ValidNetwork;
  agentId: string;
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

    const firstSync = (await client.readContract({
        abi: AgentsAbi,
        address: TARGET_DAO.NFT_ADDRESS,
        functionName: "getFirstSync",
        args: [agentId],
      })) as AgentSync;
    const imageHash = (await client.readContract({
          abi: AgentsAbi,
          address: TARGET_DAO.NFT_ADDRESS,
          functionName: "getImageHash",
          args: [agentId],
        })) as string;
    const lastSync = (await client.readContract({
          abi: AgentsAbi,
          address: TARGET_DAO.NFT_ADDRESS,
          functionName: "getLastSync",
          args: [agentId],
        })) as AgentSync;
    const TBA = (await client.readContract({
          abi: AgentsAbi,
          address: TARGET_DAO.NFT_ADDRESS,
          functionName: "getTba",
          args: [agentId],
        })) as `0x${string}`;

    const tbaBalance = (await client.readContract({
          abi: AgentsAbi,
          address: TARGET_DAO.NFT_ADDRESS,
          functionName: "getTbaBalance",
          args: [agentId],
        })) as string;

        const syncLength = (await client.readContract({
          abi: AgentsAbi,
          address: TARGET_DAO.NFT_ADDRESS,
          functionName: "getLengthSync",
          args: [agentId],
        })) as string;

        const syncPromises = [];
        for (let i = 0; i < parseInt(syncLength); i++) {
          syncPromises.push(
            client.readContract({
              abi: AgentsAbi,
              address: TARGET_DAO.NFT_ADDRESS,
              functionName: "_syncs",
              args: [agentId, i],
            })
          );
        }
        const syncs = await Promise.all(syncPromises);


    return {
      firstSync,
      imageHash,
      lastSync,
      TBA,
      tbaBalance,
      syncs
    };
  } catch (err) {
    console.log("Error", err);
    throw new Error("Error");
  }
};

export const useAgent = ({ chainId, agentId }: 
  { 
    chainId: ValidNetwork,
    agentId: string
  }) => {
  if (!chainId || !agentId) {
    throw new Error("Missing Args");
  }
  const { data, error, ...rest } = useQuery(
    [`agent`, { agentId }], 
    () => fetchAgent({ chainId, agentId }),
    { enabled: !!chainId && !!agentId }
  );
  return { ...data, error, ...rest };
};
