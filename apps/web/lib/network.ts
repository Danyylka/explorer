import "server-only";
import { preprocess, z } from "zod";
import { env } from "~/env.mjs";
import { CACHE_KEYS } from "./cache-keys";
import { cache } from "react";

export const singleNetworkSchema = z.object({
  config: z.object({
    logoUrl: z.string().url(),
    rpcUrls: z.record(
      z.enum(["evm", "cosmos", "svm", "celestia"]),
      z.string().url(),
    ),
    token: z.object({
      name: z.string().max(128),
      decimals: z.number(),
    }),
    platform: z.string().max(64).optional(),
    // TODO : These are defaulted for now, but it should be returned by the API
    widgetLayout: z
      .enum(["EvmWithPrice", "EvmWithoutPrice", "SVM", "Celestia", "Dymension"])
      .optional()
      .catch(undefined),
    // This is in HSL format, and is used like this : hsl("224 94% 51%")
    primaryColor: z.string().optional().default("256 100% 67%"),
    cssGradient: z
      .string()
      .optional()
      // this value is directly used as `background-image: linear-gradient(90deg, #0F4EF7 -10.76%, #00D5E2 98.22%);`
      .default(
        `linear-gradient(94deg, #6833FF 19.54%, #336CFF 75.56%, #33B6FF 93.7%)`,
      ),
    ecosystems: z.array(z.string()).optional().default([]),
  }),
  paidVersion: z.boolean(),
  slug: z.string(),
  chainName: z.string(),
  brand: z.string(),
  accountId: z.string(),
  internalId: z.string(),
  integrationId: z.string().uuid(),
  createdTime: preprocess((arg) => new Date(arg as any), z.date()),
});

export type SingleNetwork = z.infer<typeof singleNetworkSchema>;

export const getAllNetworks = cache(async function getAllNetworks(): Promise<
  Array<SingleNetwork>
> {
  const date = new Date().getTime();
  let allIntegrations: Array<SingleNetwork> = [];

  if (allIntegrations.length === 0) {
    let nextToken: string | null = null;

    do {
      console.time(
        `[${date}] FETCH [${CACHE_KEYS.networks
          .summary(nextToken)
          .join(", ")}]`,
      );
      const response = await fetch(
        `${
          env.INTERNAL_INTEGRATION_API_URL
        }/integrations-summary?returnAll=true&nextToken=${nextToken ?? ""}`,
        {
          cache: "force-cache",
          next: {
            tags: CACHE_KEYS.networks.summary(nextToken),
          },
        },
      ).then(async (r) => {
        const text = await r.text();
        const status = r.status;
        if (status !== 200) {
          console.log({
            res: text,
            status: r.status,
            statusText: r.statusText,
          });
        }
        return JSON.parse(text);
      });
      console.timeEnd(
        `[${date}] FETCH [${CACHE_KEYS.networks
          .summary(nextToken)
          .join(", ")}]`,
      );

      const integrationSummaryAPISchema = z.object({
        result: z
          .object({
            integrations: z.array(singleNetworkSchema.nullable().catch(null)),
            nextToken: z.string().nullish(),
          })
          .nullish(),
      });
      const { result } = integrationSummaryAPISchema.parse(response);
      nextToken = result?.nextToken ?? null;

      if (result?.integrations) {
        for (const integration of result.integrations.filter(Boolean)) {
          allIntegrations.push(integration as SingleNetwork);
        }
      }
    } while (nextToken);
  }

  allIntegrations = allIntegrations.sort((a, b) => {
    // prioritize celestia before every other chain
    if (a.brand === "celestia") return -1;
    if (b.brand === "celestia") return 1;

    // put non paid chains at the end
    if (!a.paidVersion) return 1;
    if (!b.paidVersion) return -1;
    return 0;
  });

  return allIntegrations;
});

export const getSingleNetwork = cache(async function getSingleNetwork(
  slug: string,
) {
  const describeIntegrationBySlugAPISchema = z.object({
    result: z.object({
      integration: singleNetworkSchema,
    }),
  });

  try {
    let integration: SingleNetwork | null = null;

    if (!integration) {
      const date = new Date().getTime();
      console.time(
        `[${date}] FETCH [${CACHE_KEYS.networks.single(slug).join(", ")}]`,
      );
      let { result } = await fetch(
        `${
          env.INTERNAL_INTEGRATION_API_URL
        }/integrations/slug/${encodeURIComponent(slug)}`,
        {
          cache: "force-cache",
          next: {
            tags: CACHE_KEYS.networks.single(slug),
          },
        },
      )
        .then((r) => r.json())
        .then((data) => describeIntegrationBySlugAPISchema.parse(data));
      console.timeEnd(
        `[${date}] FETCH [${CACHE_KEYS.networks.single(slug).join(", ")}]`,
      );
      integration = result.integration;
    }

    // FIXME : this is hardcoded because widgets are not supported yet on other networks other than these
    if (integration.slug === "nautilus-mainnet") {
      integration.config.widgetLayout = "EvmWithPrice";
    }
    if (integration.slug === "eclipse-devnet") {
      integration.config.widgetLayout = "SVM";
      integration.config.primaryColor = "236 15% 18%";
      integration.config.cssGradient = `linear-gradient(97deg, #000 -5.89%, #1E1E1E 83.12%, #000 103.23%)`;
    }
    if (integration.brand === "celestia") {
      integration.config.widgetLayout = "Celestia";
      integration.config.primaryColor = "256 100% 67%";
      integration.config.cssGradient = `linear-gradient(94deg, #6833FF 19.54%, #336CFF 75.56%, #33B6FF 93.7%)`;
    }
    if (integration.brand === "dymension") {
      integration.config.widgetLayout = "Dymension";
      integration.config.primaryColor = "29 13% 45%";
    }

    return integration;
  } catch (error) {
    return null;
  }
});

export const getAllPaidNetworks = cache(async function getAllPaidNetworks() {
  const allNetworks = await getAllNetworks();
  return allNetworks.filter((network) => network.paidVersion).slice(0, 30);
});
