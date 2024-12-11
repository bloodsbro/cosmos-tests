import { defineStore } from 'pinia';

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    keplrAddress: null as string | null,
    keplr: {
      balances: [],
      nfts: [],
      delegations: [],
      balanceStaked: null,
      delegation: null,
    }
  }),
  actions: {
    setKeplrAddress(address: string) {
      this.keplrAddress = address;
    },
    setKeplrBalances(balances: any[]) {
      this.keplr.balances = balances;
    },
    setKeplrNfts(nfts: any[]) {
      this.keplr.nfts = nfts;
    },
    setKeplrDelegations(delegations: any[]) {
      this.keplr.delegations = delegations;
    }
  },
  persist: true,
});
