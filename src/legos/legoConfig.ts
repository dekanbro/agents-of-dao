
import { FieldLegoBase, FormLegoBase } from "@daohaus/utils";
import { CoreFieldLookup } from "@daohaus/form-builder";
import { ImageSelect } from "../components/fields/ImageSelect";


export const AppFieldLookup = {
    ...CoreFieldLookup,
    imageSelectField: ImageSelect,
};

export type CustomFieldLego = FieldLegoBase<typeof AppFieldLookup>;
export type CustomFormLego = FormLegoBase<typeof AppFieldLookup>;
