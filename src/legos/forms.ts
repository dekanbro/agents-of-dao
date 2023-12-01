import { APP_FIELD } from "./fields";
import { CustomFormLego } from "./legoConfig";
import { TXLego } from "@daohaus/utils";
import { APP_TX } from "./tx";

export const APP_FORM: Record<string, CustomFormLego> = {
  NEW_MINT: {
    id: "NEW_MINT",
    requiredFields: { imageSelectField: true },
    log: true,
    tx: APP_TX.MINT as TXLego,
    fields: [
      APP_FIELD.IMAGE_SELECT_FIELD,
    ],
  },
};
