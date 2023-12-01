import styled from "styled-components";
import { useParams } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { formatDistanceToNowFromSeconds } from "@daohaus/utils";

import { TARGET_DAO } from "../targetDao";

import { useAgent } from "../hooks/useAgent";
import {
  Badge,
  Button,
  Label,
  Link,
  ParMd,
  SingleColumnLayout,
} from "@daohaus/ui";
import { AgentCard } from "../components/AgentCard";
import { AgentSync } from "../hooks/useAgents";
import { useHats } from "../hooks/useHats";

const ActivityGrid = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(7, 1fr);
  grid-gap: 0.25rem;
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
`;

const ActivityBox = styled.div`
  height: 15px;
  width: 15px;
  border: 1px solid #ccc;
  border-radius: 1px;
`;

const ActionButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const LinkGroup = styled.div`
  display: flex;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 10rem;
`;

const LinkGroups = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-left: 1rem;
`;

const AgentInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: 1rem;
  > {
    margin: 0 1rem;
  }
`;

const ContentWrapper = styled(SingleColumnLayout)`
  width: 50rem;
`;

const AgeGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export const ActivityViz = ({
  startDate,
  endDate,
  syncs,
}: {
  startDate: number;
  endDate: number;
  syncs?: AgentSync[];
}) => {
  const tenDaysBeforeStartDate = new Date(startDate - 10 * 24 * 60 * 60 * 1000);

  const totalDays = 280;
  const gridBoxes = [];
  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(
      tenDaysBeforeStartDate.getTime() + i * 24 * 60 * 60 * 1000
    );
    const formattedDate = currentDate.toLocaleDateString(); // Format the date as needed

    //
    if (endDate - currentDate.getTime() >= 24 * 60 * 60 * 1000) {
      let content = formattedDate;
      let color = "#ccc";
      if (i === 9) {
        content = `Born: ${formattedDate}`;
        // rgb light green
        color = "#90ee90";
      }
      gridBoxes.push(
        <ActivityBox
          key={i}
          className="grid-box"
          style={{ backgroundColor: color }}
          data-tooltip-content={content}
          data-tooltip-id={`tooltip-${i}`}
        />
      );
      continue;
    }

    // if the date is after the start date, but before todays date show a blue box
    if (
      currentDate.getTime() >= startDate &&
      currentDate.getTime() <= new Date().getTime()
    ) {
      let color = "#add8ec";
      let content = formattedDate;

      // if the current date is withen 1 day of a sync date, show a green box
      if (syncs) {
        for (let j = 0; j < syncs.length; j++) {
          const syncDate = new Date(parseInt(syncs[j].date) * 1000);
          if (
            syncDate.getTime() - currentDate.getTime() <= 24 * 60 * 60 * 1000 &&
            syncDate.getTime() - currentDate.getTime() >= 0
          ) {
            // rgb dark green
            color = "#006400";
            content = `Sync: ${syncDate.toLocaleDateString()}`;
          }
        }
      }

      gridBoxes.push(
        <ActivityBox
          key={i}
          className="grid-box"
          style={{ backgroundColor: color }}
          data-tooltip-content={content}
          data-tooltip-id={`tooltip-${i}`}
        />
      );
      continue;
    }

    gridBoxes.push(
      <ActivityBox
        key={i}
        className="grid-box"
        data-tooltip-content={formattedDate}
        data-tooltip-id={`tooltip-${i}`}
      />
    );
  }

  return (
    <>
      <ActivityGrid>{gridBoxes}</ActivityGrid>
      {gridBoxes.map((_, i) => (
        <ReactTooltip key={i} id={`tooltip-${i}`} place="top" />
      ))}
    </>
  );
};

export const AgentDetail = () => {
  // get agent from params
  const { agentId } = useParams();
  const { firstSync, imageHash, lastSync, TBA, tbaBalance, syncs, isLoading } =
    useAgent({
      chainId: TARGET_DAO.CHAIN_ID,
      agentId: agentId || "0",
    });
    const { hats, isLoading: isHatsLoading } = useHats({
      chainId: TARGET_DAO.CHAIN_ID,
      wearerAddress: TBA as `0x${string}`,
    });

  if (isLoading) {
    return <div>loading...</div>;
  }
  if (!agentId || !firstSync || !lastSync || !imageHash || !TBA) {
    return <div>no agent id</div>;
  }

  return (
    <ContentWrapper>
      <AgentInfo>
        <AgentCard
          token={{
            tokenId: agentId,
            firstSync,
            imageHash,
            lastSync,
            TBA,
            tbaBalance: tbaBalance || "0",
          }}
        />
        <LinkGroups>
          <Label>1 ups:</Label>
          <LinkGroup>
            <Badge badgeLabel={"20 🍄"} />
            <Button variant="ghost" size="sm">
              Give +1
            </Button>
          </LinkGroup>
          <Label>Roles:</Label>
          <LinkGroup>
          {/* hats */}
          {isHatsLoading && <div>loading...</div>}
          {hats && hats.map((hat, i) => (
            <ParMd key={i}>🎩 {hat.details.data.name}</ParMd>
          ))}
          </LinkGroup>
          <Label>Links:</Label>
          <LinkGroup>
            <ParMd>📃</ParMd>
            <ParMd>📃</ParMd>
            <Link
              style={{ fontSize: ".5rem" }}
              href={`https://ipfs.io/ipfs/bafybeihonphdxvmf4zx7lgztvy7gwez25bvxkqsjpmdhj7l5owiwgeunhi/#/new`}
            >
              Add
            </Link>
          </LinkGroup>
        </LinkGroups>
      </AgentInfo>

      {firstSync && lastSync && (
        <>
          <AgeGroup>
            <ParMd>
              Born {formatDistanceToNowFromSeconds(firstSync.date.toString())}
            </ParMd>
          </AgeGroup>
          <ActivityViz
            startDate={parseInt(firstSync?.date) * 1000}
            endDate={parseInt(lastSync?.date) * 1000}
            syncs={syncs as AgentSync[]}
          />
        </>
      )}
      <ActionButtonGroup>
        <Link
          href={`https://tokenbound.org/assets/goerli/${TARGET_DAO.NFT_ADDRESS}/${agentId}`}
        >
          <Button variant="ghost">TokenBound</Button>
        </Link>
      </ActionButtonGroup>
    </ContentWrapper>
  );
};
