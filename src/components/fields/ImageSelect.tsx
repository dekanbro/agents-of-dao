import { Buildable, SingleColumnLayout } from "@daohaus/ui";

import { useState } from "react";
import { useFormContext } from "react-hook-form";

import styled from "styled-components";
import { TARGET_DAO } from "../../targetDao";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-gap: 1rem;
  margin-bottom: 1rem;
`;

const GridItem = styled.div<{ isselected: number | undefined }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: ${(props) => (props.isselected ? "2px solid blue" : "none")};
  opacity: 1;
  transition: opacity 0.3s ease;
  width: 100%;
  height: auto;

  &:hover {
    opacity: 0.7;
  }
`;

export const ImageSelect = (props: Buildable<object>) => {
  const { setValue } = useFormContext();

  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
    setValue(props.id, src);
  };

  const numProfiles = 40;
  const baseURI = `https://ipfs.io/ipfs/${TARGET_DAO.THUMBS}/`;

  return (
    <SingleColumnLayout>
      <GridContainer>
        {Array.from(Array(numProfiles).keys()).map((i) => {
          const src = `${baseURI}${i + 1}.jpg`;
          return (
            <GridItem
              key={i + 1}
              isselected={(selectedImage === src) ? 1 : 0}
              onClick={() => handleImageClick(src)}
            >
              <img src={src} alt={`profile ${i + 1}`} width="60" height="60" />
            </GridItem>
          );
        })}
      </GridContainer>
    </SingleColumnLayout>
  );
};
