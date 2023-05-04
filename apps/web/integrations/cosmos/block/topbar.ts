import { TransformInput, TransformOutput } from "@modularcloud/ecs";
import { BlockExtract } from ".";
import { TopbarComponent } from "../../../ecs/components/topbar";

export const TopbarTransform = {
  schema: TopbarComponent,
  transform: async ({
    data,
    metadata,
  }: TransformInput<typeof BlockExtract>): Promise<
    TransformOutput<typeof TopbarComponent>
  > => ({
    typeId: "topbar",
    data: {
      logo: metadata.network.logoUrl,
      entityTypeName: "Block",
      entityId: data.result.block_id.hash,
    },
  }),
};
