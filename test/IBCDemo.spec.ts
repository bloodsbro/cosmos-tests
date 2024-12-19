import { describe, it, expect, vi, beforeEach } from "vitest";
import { MsgTransferEncodeObject, SigningStargateClient } from "@cosmjs/stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { useRuntimeConfig } from "#app";
import * as IBCComposable from "../composables/useIBC";

const rpcEndpoint = "https://go.getblock.io/65ef9c5d71c1477bb8cd6afa3bcd09ec"

vi.mock("#app", () => ({
  useRuntimeConfig: vi.fn(() => ({
    public: {
      testMnemonic: "dish random weapon thrive holiday fatigue glass junior lawsuit churn derive toss",
      rpcEndpoint: rpcEndpoint
    },
  })),
}));

describe("IBC Transaction Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getWallet', () => {
    it('should return valid wallet', async () => {
      const wallet: DirectSecp256k1HdWallet = await IBCComposable.getWallet(true, "dish random weapon thrive holiday fatigue glass junior lawsuit churn derive toss");
      const accounts = await wallet.getAccounts()

      expect(accounts[0]?.address === 'cosmos12wvpkpdp5dc2mz8teerqg0aq75f93w2dpumvs9')
    })
  })

  describe("getClient", () => {
    it("should return a SigningStargateClient with mnemonic", async () => {
      const client = await IBCComposable.getClient(true, "dish random weapon thrive holiday fatigue glass junior lawsuit churn derive toss");

      expect(client instanceof SigningStargateClient)
      expect()
    });
  });

  describe("simulateIBCTransaction", () => {
    it("should simulate an IBC transaction and return gas estimation", async () => {
      const gasEstimation = await IBCComposable.simulateIBCTransaction(
        "cosmos12wvpkpdp5dc2mz8teerqg0aq75f93w2dpumvs9",
        "osmo12wvpkpdp5dc2mz8teerqg0aq75f93w2df8guxh",
        "1000",
        "cosmoshub-4",
        true,
        "dish random weapon thrive holiday fatigue glass junior lawsuit churn derive toss"
      );

      expect(gasEstimation).toBeTypeOf('number');
    });

    it("should throw an error if simulation fails (invalid data)", async () => {
      await expect(
        IBCComposable.simulateIBCTransaction(
          "invalid address",
          "osmo12wvpkpdp5dc2mz8teerqg0aq75f93w2df8guxh",
          "1000",
          "cosmoshub-4",
          true,
          "dish random weapon thrive holiday fatigue glass junior lawsuit churn derive toss"
        )
      ).rejects.toThrowError('Error: Failed to retrieve account from signer');
    });
  });

  describe("sendIBCTransaction", () => {
    it("should throw an error if account is not found", async () => {
      await expect(
        IBCComposable.sendIBCTransaction(
          "cosmos12wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww0zj9rr",
          "osmo12wvpkpdp5dc2mz8teerqg0aq75f93w2df8guxh",
          "1000",
          "cosmoshub-4",
          true,
          "dish random weapon thrive holiday fatigue glass junior lawsuit churn derive toss"
        )
      ).rejects.toThrow("sourceAddress account not found");
    });
  });
});
