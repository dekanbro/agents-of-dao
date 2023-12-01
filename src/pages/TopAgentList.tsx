
import styled from "styled-components";
import { TARGET_DAO } from "../targetDao";

import { useAgents } from "../hooks/useAgents";
import { AgentCard } from "../components/AgentCard";
import { ParMd } from "@daohaus/ui";

const CardWrapper = styled.div`
  margin: 1rem;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-items: center;
`;


export const TopAgentList = () => {
  const { tokens } =
    useAgents({
      chainId: TARGET_DAO.CHAIN_ID,
    });

  // filter out invalid tokens
  tokens?.filter((token) => {
    return token.lastSync.invalid === false;
  });

  // sort tokens by amount
  tokens?.sort((a, b) => {
    return (
      parseInt(b.lastSync.amount) - parseInt(a.lastSync.amount)
    );
  });


  return (
    <CardWrapper>
            {tokens?.length === 0 && <div><ParMd>No Agents Of DAO yet</ParMd></div>}

      {tokens?.map((token, idx) => {
        return (
          <AgentCard key={idx} token={token} />
        )
      })}
    </CardWrapper>
  );
};
