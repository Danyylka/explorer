import {
  TokenBalance,
  Event,
  Token,
  Holder,
  TxRef,
  TokenBalanceSchema,
  EventSchema,
  TokenSchema,
  HolderSchema,
  TxRefSchema,
} from "./schemas";

declare global {
  var fetch: typeof import("undici").fetch;
}

export interface ModularCloud {
  evm: {
    getTokenBalancesByAddress: (
      networkId: string,
      address: string
    ) => Promise<TokenBalance[]>;
    getEventsByTokenAddress: (
      networkId: string,
      address: string,
      maxResults?: number,
      nextToken?: string
    ) => Promise<Event[]>;
    getEventsByAccountAddress: (
      networkId: string,
      address: string,
      maxResults?: number,
      nextToken?: string
    ) => Promise<Event[]>;
    getTokenByAddress: (networkId: string, address: string) => Promise<Token>;
    getAccountBalancesByTokenAddress: (
      networkId: string,
      address: string,
      maxResults?: number,
      nextToken?: string
    ) => Promise<Holder[]>;
    getTransactionsByAddress: (
      networkId: string,
      address: string,
      maxResults?: number,
      nextToken?: string
    ) => Promise<TxRef[]>;
  };
}

type APIResponse = {
  result: any;
};

const NETWORK_ID_MAP: Record<string, string> = {
  "triton": "eclipse/91002"
}

function normalizeNetworkId(networkId: string) {
  return NETWORK_ID_MAP[networkId] || networkId;
}

export function createModularCloud(baseUrl?: string): ModularCloud {
  if (!baseUrl) {
    throw new Error("Base URL is required to initialize Modular Cloud.");
  }

  const instance: ModularCloud = {
    evm: {
      getTokenBalancesByAddress: async (networkId: string, address: string) => {
        const response = await fetch(
          `${baseUrl}/${normalizeNetworkId(networkId)}/token-balances/${address}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch token balances");
        }

        const json = (await response.json()) as APIResponse;
        return TokenBalanceSchema.array().parse(json.result.balances);
      },
      getEventsByTokenAddress: async (
        networkId: string,
        address: string,
        maxResults: number = 30,
        nextToken?: string
      ) => {
        const response = await fetch(
          `${baseUrl}/${normalizeNetworkId(networkId)}/token-events/${address}?maxResults=${maxResults}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const json = (await response.json()) as APIResponse;
        return EventSchema.array().parse(json.result.events);
      },
      getEventsByAccountAddress: async (
        networkId: string,
        address: string,
        maxResults: number = 30,
        nextToken?: string
      ) => {
        const response = await fetch(
          `${baseUrl}/${normalizeNetworkId(networkId)}/account-events/${address}?maxResults=${maxResults}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const json = (await response.json()) as APIResponse;
        return EventSchema.array().parse(json.result.events);
      },
      getTokenByAddress: async (networkId: string, address: string) => {
        const response = await fetch(
          `${baseUrl}/${normalizeNetworkId(networkId)}/token/${address}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const json = (await response.json()) as APIResponse;
        return TokenSchema.parse(json.result);
      },
      getAccountBalancesByTokenAddress: async (
        networkId: string,
        address: string,
        maxResults: number = 30,
        nextToken?: string
      ) => {
        const response = await fetch(
          `${baseUrl}/${normalizeNetworkId(networkId)}/holder-balances/${address}?maxResults=${maxResults}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch token balances");
        }

        const json = (await response.json()) as APIResponse;
        return HolderSchema.array().parse(json.result);
      },
      getTransactionsByAddress: async (
        networkId: string,
        address: string,
        maxResults: number = 30,
        nextToken?: string
      ) => {
        const response = await fetch(
          `${baseUrl}/${normalizeNetworkId(networkId)}/transactions/${address}?maxResults=${maxResults}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const json = (await response.json()) as APIResponse;
        return TxRefSchema.array().parse(json.result.txs);
      },
    },
  };

  return instance;
}
