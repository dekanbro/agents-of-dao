import { ValidNetwork } from "@daohaus/keychain-utils";
import { EthAddress } from "@daohaus/utils";

export const TARGET_DAO: {
  CHAIN_ID: ValidNetwork;
  NFT_ADDRESS: EthAddress;
  DAO_ADDRESS: EthAddress;
  SAFE_ADDRESS: EthAddress;
  NFT_PRICE: string;
  CHAMPS: string;
  THUMBS: string;
} = {
  CHAIN_ID: "0x5", // 0xa
  NFT_ADDRESS: "0xf95875b306963ff31743CEd3f83b312da39F4742",
  DAO_ADDRESS: "0xc035dd7cda32ae73f0f306ed56658527aad47648",
  SAFE_ADDRESS: "0x36824793440d1ab326b9b5634418393d5f5e30a3",
  NFT_PRICE: "420000000000000",
  CHAMPS: "QmSnuGc5gcBVzkcGLu7HWwmmUvhxY6XhmsqDu9U5KDBLYt",
  THUMBS: "QmUh78NW1MkWAGwRvpifaXPG8wuuDHW7Da7X1pgkYWxZVy",
};
