import { APP_CONTRACT } from "./contracts";

export const APP_TX = {
    MINT: {
        id: "MINT",
        contract: APP_CONTRACT.AGENTS_NFT,
        method: 'mint',
        args: [
          ".memberAddress",
          ".formValues.imageSelectField",
        ],
        disablePoll: true,
      },
    }