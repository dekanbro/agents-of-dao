// import { useDHConnect } from "@daohaus/connect";
import styled from "styled-components";

import { FormBuilder } from "@daohaus/form-builder";

import { APP_FORM } from "../legos/forms";
import { AppFieldLookup } from "../legos/legoConfig";
import { ParSm } from "@daohaus/ui";

const MintFormWrapper = styled.div`
  width: 100%;
  margin-top: -80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  > button {
    content: "Mint";
  }
`;

export const Home = () => {
  // const { publicClient, address } = useDHConnect();

  return (

    <MintFormWrapper>
      <FormBuilder form={APP_FORM.NEW_MINT} customFields={AppFieldLookup} />
      <ParSm>Mint Your Agent</ParSm>
    </MintFormWrapper>

  );
};
