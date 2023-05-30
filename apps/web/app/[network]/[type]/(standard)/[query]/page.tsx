import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageArchetype } from "../../../../../ecs/archetypes/page";
import { asyncUseEntity } from "../../../../../ecs/hooks/use-entity/server";
import { FetchLoadArgs, getWhitelabel } from "../../../../../lib/utils";
import DescriptionList from "../../../../../ui/description-list";
import { Raw } from "../../../../../ui/raw";
import { Tabs } from "../../../../../ui/tabs";

type Props = {
  params: FetchLoadArgs;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const whitelabel = getWhitelabel();

  const entity = await asyncUseEntity({
    resourcePath: params,
    archetype: PageArchetype,
  });
  if (!entity)
    return {
      title: `Not Found - ${whitelabel.name.join("")}`,
    };

  return {
    title: `${
      entity.components.page.data.metadata.title
    } - ${whitelabel.name.join("")}`,
    description: entity.components.page.data.metadata.description,
    keywords: entity.components.page.data.metadata.keywords,
  };
}

export default async function EntityPage({ params }: Props) {
  const entity = await asyncUseEntity({
    resourcePath: params,
    archetype: PageArchetype,
  });
  if (!entity) notFound();

  // temporary until we create a new component
  const { attributes, asyncAttributes, entityTypeName, entityId } =
    entity.components.sidebar.data;

  return (
    <>
      <DescriptionList
        attributes={attributes}
        asyncAttributes={asyncAttributes}
        title={`${entityTypeName} Information`}
        subTitle={entityId}
      />
      <Suspense>
        {/* @ts-expect-error Async Server Component */}
        <Tabs params={params} />
      </Suspense>
    </>
  );
}
