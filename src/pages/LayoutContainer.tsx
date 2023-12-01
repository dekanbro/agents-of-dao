import { DHLayout, useDHConnect } from "@daohaus/connect";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import { TXBuilder } from "@daohaus/tx-builder";
import { TARGET_DAO } from "../targetDao";
import { widthQuery } from "@daohaus/ui";


const OuterLayoutContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgb(0, 0, 0);
  position: absolute;
  top: 0;
  padding-top: 1rem;
  padding: 1rem;
  @media ${widthQuery.sm} {
    .title {
      font-size: 3.5rem;
      margin-bottom: 2rem;
    }
  }
`;

export const LayoutContainer = () => {
  const location = useLocation();
  const { publicClient, address } = useDHConnect();

  return (
      <OuterLayoutContainer>
      <DHLayout navLinks={[
        { label: "New", href: `/` },
        { label: "My Agents", href: `/agent` },
        { label: "Top Agents", href: `/top-agents` },
        { label: "About", href: `/` },
      ]} pathname={location.pathname}>

        <TXBuilder
          publicClient={publicClient}
          chainId={TARGET_DAO.CHAIN_ID}
          daoId={TARGET_DAO.DAO_ADDRESS}
          safeId={TARGET_DAO.SAFE_ADDRESS}
          appState={{ memberAddress: address }}
        >
          <Outlet />
        </TXBuilder>

      </DHLayout>
      </OuterLayoutContainer>

  );
};
