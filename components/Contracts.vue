<template>
  <v-container class="mt-5">
    <v-card class="pa-5">
      <h2 class="text-center">Виконання контракту</h2>
      
      <v-alert :type="status.type" class="mb-4" v-if="status.message">
        {{ status.message }}
      </v-alert>
      
      <v-text-field
        label="Адреса контракту"
        v-model="contractAddress"
        outlined
      ></v-text-field>
      
      Інформаця про контракт:
      <v-textarea
        readonly
        rows="6"
        :value="JSON.stringify(contract, null, 2)"
      ></v-textarea>
      
      <h3 class="mt-4">Дані контракту</h3>
      <div v-for="(field, index) in contractFields" :key="index" class="mb-3">
        <v-text-field
          label="Ключ"
          v-model="field.key"
          outlined
          dense
          class="mr-3"
        ></v-text-field>
        <v-text-field
          label="Значення"
          v-model="field.value"
          outlined
          dense
        ></v-text-field>
        <v-btn
          icon
          color="red"
          @click="removeField(index)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
      
      <v-btn
        color="green"
        @click="addField"
        class="mb-4"
      >
        Додати поле
      </v-btn>
      
      <v-btn color="primary" block @click="executeContract">
        Виконати контракт
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";

const { rpcEndpoint } = useRuntimeConfig().public;

const walletStore = useWalletStore();
const contract = ref({});
const status = ref({
  type: "info",
  message: "Очікування",
});
const contractAddress = ref<string>("cosmos18cszlvm6pze0x9sz32qnjq4vtd45xehqs8dq7cwy8yhq35wfnn3q795n8y");

// Изначально data будет массивом ключ-значение
const contractFields = ref([
  { key: "transfer.recipient", value: walletStore.keplrAddress },
  { key: "transfer.amount", value: "10" },
]);

// Синхронизация contractData с полями формы
const contractData = computed(() => {
  const result: Record<string, any> = {};
  contractFields.value.forEach((field) => {
    if (field.key.includes(".")) {
      const keys = field.key.split(".");
      keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
          acc[key] = field.value;
        } else {
          acc[key] = acc[key] || {};
        }
        return acc[key];
      }, result);
    } else {
      result[field.key] = field.value;
    }
  });
  return JSON.stringify(result, null, 2);
});

// Динамическое добавление и удаление полей
const addField = () => {
  contractFields.value.push({ key: "", value: "" });
};

const removeField = (index: number) => {
  contractFields.value.splice(index, 1);
};

// Загрузка контракта
watch(
  contractAddress,
  async (newValue) => {
    if (!newValue) return;
    
    const client = await CosmWasmClient.connect(rpcEndpoint);
    contract.value = await client.getContract(newValue);
  },
  { immediate: true }
);

// Проверка Keplr
onMounted(() => {
  if (!window.keplr) {
    status.value = {
      type: "error",
      message: "Keplr не найден",
    };
  }
});

// Выполнение контракта
const executeContract = async () => {
  if (!window.keplr) return;
  
  const gasPrice = GasPrice.fromString("0.0025uatom");
  const chainId = "cosmoshub-4";
  
  await window.keplr.enable(chainId);
  const offlineSigner = window.getOfflineSigner(chainId);
  const client = await SigningCosmWasmClient.connectWithSigner(
    "https://cors.standoffarena.com/https://cosmos-rpc.publicnode.com:443",
    offlineSigner,
    { gasPrice }
  );
  
  try {
    const result = await client.execute(
      walletStore.keplrAddress,
      contractAddress.value,
      JSON.parse(contractData.value),
      "auto",
      "Execute Increment"
    );
    status.value = {
      type: "success",
      message: `Результат виконання контракту: ${JSON.stringify(result)}`,
    };
  } catch (error) {
    status.value = {
      type: "error",
      message: `Помилка виконання контракту: ${error.message}`,
    };
    console.error("Помилка виконання контракту:", error);
  }
};
</script>
