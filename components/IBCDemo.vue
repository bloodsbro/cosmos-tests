<template>
  <v-container class="mt-5">
    <v-card class="pa-5">
      <h2 class="text-center">IBC Transfer Demo</h2>
      <v-alert
        :type="status.type"
        class="mb-4"
        v-if="status.message"
      >
        {{ status.message }}
      </v-alert>
      
      <v-form>
        <v-text-field
          label="Ваша адреса (Cosmos)"
          v-model="keplrAddress"
          outlined
          required
        ></v-text-field>
        <v-text-field
          label="Адреса одержувача"
          v-model="receiveAddress"
          outlined
          required
        ></v-text-field>
        <v-text-field
          label="Сума для переказу (uatom)"
          type="number"
          v-model="amount"
          outlined
          required
        ></v-text-field>
        <v-switch label="Використовувати сід фразу?" v-model="useSeed">
        </v-switch>
        <v-btn color="primary" class="mt-4" block @click="handleIBCTransfer">
          Відправити IBC переказ
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { sendIBCTransaction } from '@/composables/useIBC';
import { useWalletStore } from "~/stores/wallet";

const useSeed = ref(false);

const status = ref({
  type: 'info',
  message: 'Очікування команди',
});
const walletStore = useWalletStore();
const keplrAddress = computed(() => walletStore.keplrAddress);
const receiveAddress = ref('osmo12wvpkpdp5dc2mz8teerqg0aq75f93w2df8guxh');
const amount = ref(1);

const handleIBCTransfer = async () => {
  try {
    const result = await sendIBCTransaction(
      keplrAddress.value,
      receiveAddress.value,
      amount.value,
      "cosmoshub-4",
      useSeed.value
    );
    
    status.value = {
      type: 'success',
      message: `Транзакцію успішно виконано на висоті ${result.height}.`,
    };
  } catch (error) {
    status.value = {
      type: 'error',
      message: `Помилка під час виконання IBC: ${error.message}.`,
    };
    console.error(error);
  }
};
</script>
