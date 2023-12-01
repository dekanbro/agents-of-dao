import { useDHConnect } from "@daohaus/connect";

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

export const AgentList = () => {
  const { address } = useDHConnect();
  const { supply, tokens } = useAgents({
    chainId: TARGET_DAO.CHAIN_ID,
    ownerAddress: address as `0x${string}`,
  });
  console.log("records >>", supply, tokens);
  return (
    <CardWrapper>
      {tokens?.length === 0 && <div><ParMd>You Have No Agents. Go mint one now.</ParMd></div>}
      {tokens?.map((token, idx) => {
        return <AgentCard token={token} key={idx} />;
      })}
    </CardWrapper>
  );
};
