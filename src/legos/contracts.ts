import { ContractLego } from "@daohaus/utils";
import AgentsNFTAbi from "../abis/AgentsNFT.json";

import { TARGET_DAO } from "../targetDao";

export const APP_CONTRACT: Record<string, ContractLego> = {
    AGENTS_NFT: {
      type: "static",
      contractName: "AGENTS_NFT",
      abi: AgentsNFTAbi,
      targetAddress: TARGET_DAO.NFT_ADDRESS,
    },
  };
  