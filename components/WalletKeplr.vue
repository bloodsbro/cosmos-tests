<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import { useWalletStore } from '~/stores/wallet';
import { SigningCosmosClient} from "@cosmjs/launchpad";
import {CosmWasmClient} from "@cosmjs/cosmwasm-stargate";
import {SigningStargateClient} from "@cosmjs/stargate";
const { rpcEndpoint } = useRuntimeConfig().public;
import { Window as KeplrWindow } from "@keplr-wallet/types"

const walletStore = useWalletStore();
const keplrAddress = computed(() => walletStore.keplrAddress);

const chainid = 'cosmoshub-4';
const status = ref({
  type: 'info',
  message: import.meta.server ? 'Ініціалізація' : KeplrWindow.keplr ? `Очікуємо на запит` : 'Keplr не знайдений',
});
const balance = ref(null);
const nfts = ref([]);
const balanceStacked = ref(null);
const delegation = ref(0);

onMounted(async () => {
  if (keplrAddress.value) {
    status.value = {
      type: 'success',
      message: `Підключений: ${keplrAddress.value}`,
    };
    
    await fetchData(keplrAddress.value);
  }
  
  if (KeplrWindow.keplr) {
    await KeplrWindow.keplr.enable(chainid);
  }
});

const connectKeplr = async () => {
  if (!KeplrWindow.keplr) {
    status.value = {
      type: 'error',
      message: 'Keplr не знайдений',
    };
    
    return;
  }
  
  try {
    const offlineSigner = KeplrWindow.getOfflineSigner(chainid);
    const accounts = await offlineSigner.getAccounts();
    const address = accounts[0].address;
    
    walletStore.setKeplrAddress(address);
    status.value = {
      type: 'success',
      message: `Підключений: ${address}`,
    };
    
    await fetchData(address);
  } catch (error) {
    console.error("Помилка підключення Keplr:", error);
    status.value = {
      type: 'error',
      message: `Помилка підключення Keplr: ${error.message}`,
    };
  }
};

const fetchData = async (address: string) => {
  await KeplrWindow.keplr.enable('cosmoshub-4');
  
  const client2 = await SigningStargateClient.connect(rpcEndpoint);
  
  if (walletStore.keplr.balances.length <= 0) {
    walletStore.setKeplrBalances(await client2.getAllBalances(address));
  }
  
  balance.value = walletStore.keplr.balances;
  
  if (walletStore.keplr.delegation === null) {
    walletStore.keplr.delegation = await client2.getDelegation(address, 'cosmosvaloper14l0fp639yudfl46zauvv8rkzjgd4u0zk2aseys') ?? 0;
  }
  
  delegation.value = walletStore.keplr.delegation;
  
  if (walletStore.keplr.balanceStaked === null) {
    walletStore.keplr.balanceStaked = await client2.getBalanceStaked(address) ?? 0;
  }
  
  balanceStacked.value = walletStore.keplr.balanceStaked;
};
</script>

<template>
  <v-container class="mt-5">
    <v-card class="pa-5">
      <h2 class="text-center">Підключення Keplr</h2>
      <v-alert
        :type="status.type"
        class="mb-4"
        v-if="status.message"
      >
        {{ status.message }}
      </v-alert>
      <v-btn color="primary" block @click="connectKeplr">
        Підключити Keplr
      </v-btn>
      
      <v-card-title>Інформація про баланс і NFT</v-card-title>
      <v-card-text>
        <div><strong>Баланс:</strong> {{ balance }}</div>
        <div><strong>NFT:</strong> {{ nfts }}</div>
        <div><strong>delegation:</strong> {{ delegation }}</div>
        <div><strong>balanceStacked:</strong> {{ balanceStacked }}</div>
      </v-card-text>
    </v-card>
  </v-container>
</template>
