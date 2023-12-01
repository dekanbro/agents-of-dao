import {
  AddressDisplay,
  Avatar,
  Button,
  Card,
  Label,
  ParMd,
} from "@daohaus/ui";
import { toWholeUnits } from "@daohaus/utils";
import styled from "styled-components";
import { TARGET_DAO } from "../targetDao";

import { Link } from "react-router-dom";
import { TokenIdInfo } from "../hooks/useAgents";

const AgentCardInner = styled(Card)`
  display: flex;
`;

const CardTitle = styled(ParMd)``;

const CardDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 2rem;
`;

const CardImg = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const AddressWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

export const AgentCard = ({ token }: { token: TokenIdInfo }) => {
  console.log(token);
  return (
    <AgentCardInner>
      <CardImg>
        <CardTitle>{`Agent ${token.tokenId}`}</CardTitle>
        <Link to={`/agent/${token.tokenId}`}>
          {token.imageHash && (
            <Avatar
              size="2xl"
              src={`https://ipfs.io/ipfs/${TARGET_DAO.THUMBS}/${
                token.imageHash.split("/")[
                  token.imageHash.split("/").length - 1
                ]
              }`}
              alt={`Agent ${token.tokenId}`}
            />
          )}
        </Link>
        <Link to={`/agent/${token.tokenId}`}>Details</Link>
        <AddressWrapper><Label>Owner</Label>
        <AddressDisplay
          truncate
          copy
          explorerNetworkId={TARGET_DAO.CHAIN_ID}
          address={token.lastSync.owner}
        />
        </AddressWrapper>
        <AddressWrapper>
        <Label>TBA</Label>
        <AddressDisplay
          truncate
          copy
          explorerNetworkId={TARGET_DAO.CHAIN_ID}
          address={token.TBA as `0x${string}`}
        />
        </AddressWrapper>
      </CardImg>
      <CardDescription>
        {token && (
          <>
            <ParMd>
              {`Born: ${new Date(
                parseInt(token.firstSync.date) * 1000
              ).toLocaleDateString()}`}
            </ParMd>
            <ParMd>
              {`Last Sync: ${new Date(
                parseInt(token.lastSync.date) * 1000
              ).toLocaleDateString()}`}
            </ParMd>
            <ParMd>{`Amount: ${toWholeUnits(token.lastSync.amount)}`}</ParMd>
            <ParMd>{`TBA Balance: ${toWholeUnits(token.tbaBalance)}`}</ParMd>
            <ParMd>{`invalid: ${token.lastSync.invalid}`}</ParMd>

            <ParMd>
              {token.lastSync.amount != token.tbaBalance
                ? "needs sync"
                : "synced"}
            </ParMd>
            <Button variant="ghost">Sync</Button>
          </>
        )}
      </CardDescription>
    </AgentCardInner>
  );
};
