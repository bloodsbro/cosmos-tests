<template>
  <v-container class="mt-5">
    <v-card class="pa-5">
      <h2 class="text-center">Виконання контракту</h2>
      <v-alert
        :type="status.type"
        class="mb-4"
        v-if="status.message"
      >
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
      >
      
      </v-textarea>
      <v-textarea
        label="data"
        v-model="contractData"
        outlined
      ></v-textarea>
      <v-btn color="primary" block @click="executeContract">
        Виконати контракт
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {CosmWasmClient, SigningCosmWasmClient} from '@cosmjs/cosmwasm-stargate';
import {GasPrice} from "@cosmjs/stargate";
const { rpcEndpoint } = useRuntimeConfig().public;

const walletStore = useWalletStore();
const contract = ref({});

const status = ref({
  type: 'info',
  message: 'Очікування',
});
const contractAddress = ref<string>('cosmos18cszlvm6pze0x9sz32qnjq4vtd45xehqs8dq7cwy8yhq35wfnn3q795n8y');
const contractData = ref(JSON.stringify({
  "instantiate2_contract_with_self_admin": {
    "code_id": 1,
    "expect": "cosmos172ymjhfcxmm0c7fnf9gclhn6z5kcxkv3khkg0xgdrejl9dvce2kqmdrmed",
    "instantiate_msg": "eyJhZG1pbiI6bnVsbCwiYXV0b21hdGljYWxseV9hZGRfY3cyMHMiOnRydWUsImF1dG9tYXRpY2FsbHlfYWRkX2N3NzIxcyI6dHJ1ZSwiZGVzY3JpcHRpb24iOiJNeU15RGFvREFPIiwiaW1hZ2VfdXJsIjpudWxsLCJuYW1lIjoiTXlNeURhb0RBTyIsInByb3Bvc2FsX21vZHVsZXNfaW5zdGFudGlhdGVfaW5mbyI6W3siYWRtaW4iOnsiY29yZV9tb2R1bGUiOnt9fSwiY29kZV9pZCI6MTMsImxhYmVsIjoiZGFvLXByb3Bvc2FsLXNpbmdsZV8xNzMwMjI0ODQ1MjcxIiwibXNnIjoiZXlKaGJHeHZkMTl5WlhadmRHbHVaeUk2Wm1Gc2MyVXNJbU5zYjNObFgzQnliM0J2YzJGc1gyOXVYMlY0WldOMWRHbHZibDltWVdsc2RYSmxJanAwY25WbExDSnRZWGhmZG05MGFXNW5YM0JsY21sdlpDSTZleUowYVcxbElqbzJNRFE0TURCOUxDSnZibXg1WDIxbGJXSmxjbk5mWlhobFkzVjBaU0k2ZEhKMVpTd2ljSEpsWDNCeWIzQnZjMlZmYVc1bWJ5STZleUp0YjJSMWJHVmZiV0Y1WDNCeWIzQnZjMlVpT25zaWFXNW1ieUk2ZXlKaFpHMXBiaUk2ZXlKamIzSmxYMjF2WkhWc1pTSTZlMzE5TENKamIyUmxYMmxrSWpveE1Td2liR0ZpWld3aU9pSmtZVzh0Y0hKbExYQnliM0J2YzJVdGMybHVaMnhsWHpFM016QXlNalE0TkRVeU56RWlMQ0p0YzJjaU9pSmxlVXByV2xoQ2RtTXliREJZTW14MVdtMDRhVTl0TlRGaVIzZHpTVzVPTVZsdE1YQmpNMDV3WWpJMVptTkhPWE5oVjA0MVNXcHdOMGx1VG5kYVYwNXdXbTFzYWtscWNEZEpiVkpvWWpFNWRGcFhNV2xhV0VwNlNXcHdNR051Vm14TVEwcG9Za2Q0ZG1ReWVIQmpNMUZwVDJ4MFpFeERTbXRhVnpVMVlrZHNlbVJEU1RaWE1URTVabE4zYVZwWWFEQmFWelY2WVZjNWRVbHFjRGRtV0RBOUlpd2lablZ1WkhNaU9sdGRmWDE5TENKMGFISmxjMmh2YkdRaU9uc2lkR2h5WlhOb2IyeGtYM0YxYjNKMWJTSTZleUp4ZFc5eWRXMGlPbnNpY0dWeVkyVnVkQ0k2SWpBdU1qQWlmU3dpZEdoeVpYTm9iMnhrSWpwN0ltMWhhbTl5YVhSNUlqcDdmWDE5ZlN3aWRtVjBieUk2Ym5Wc2JIMD0iLCJmdW5kcyI6W119LHsiYWRtaW4iOnsiY29yZV9tb2R1bGUiOnt9fSwiY29kZV9pZCI6MTIsImxhYmVsIjoiZGFvLXByb3Bvc2FsLW11bHRpcGxlXzE3MzAyMjQ4NDUyNzEiLCJtc2ciOiJleUpoYkd4dmQxOXlaWFp2ZEdsdVp5STZabUZzYzJVc0ltTnNiM05sWDNCeWIzQnZjMkZzWDI5dVgyVjRaV04xZEdsdmJsOW1ZV2xzZFhKbElqcDBjblZsTENKdFlYaGZkbTkwYVc1blgzQmxjbWx2WkNJNmV5SjBhVzFsSWpvMk1EUTRNREI5TENKdmJteDVYMjFsYldKbGNuTmZaWGhsWTNWMFpTSTZkSEoxWlN3aWNISmxYM0J5YjNCdmMyVmZhVzVtYnlJNmV5SnRiMlIxYkdWZmJXRjVYM0J5YjNCdmMyVWlPbnNpYVc1bWJ5STZleUpoWkcxcGJpSTZleUpqYjNKbFgyMXZaSFZzWlNJNmUzMTlMQ0pqYjJSbFgybGtJam94TUN3aWJHRmlaV3dpT2lKa1lXOHRjSEpsTFhCeWIzQnZjMlV0YlhWc2RHbHdiR1ZmTVRjek1ESXlORGcwTlRJM01TSXNJbTF6WnlJNkltVjVTbXRhV0VKMll6SnNNRmd5YkhWYWJUaHBUMjAxTVdKSGQzTkpiVlkwWkVkV2RXTXliSFppYVVrMlpUTXdjMGx1VGpGWmJURndZek5PY0dJeU5XWmpSemx6WVZkT05VbHFjRGRKYms1M1dsZE9jRnB0YkdwSmFuQTNTVzFTYUdJeE9YUmFWekZwV2xoS2VrbHFjREJqYmxac1RFTkthR0pIZUhaa01uaHdZek5SYVU5c2RHUk1RMHByV2xjMU5XSkhiSHBrUTBrMlZ6RXhPV1pZTUQwaUxDSm1kVzVrY3lJNlcxMTlmWDBzSW5abGRHOGlPbTUxYkd3c0luWnZkR2x1WjE5emRISmhkR1ZuZVNJNmV5SnphVzVuYkdWZlkyaHZhV05sSWpwN0luRjFiM0oxYlNJNmV5SndaWEpqWlc1MElqb2lNQzR5TUNKOWZYMTkiLCJmdW5kcyI6W119XSwidm90aW5nX21vZHVsZV9pbnN0YW50aWF0ZV9pbmZvIjp7ImFkbWluIjp7ImNvcmVfbW9kdWxlIjp7fX0sImNvZGVfaWQiOjE1LCJsYWJlbCI6ImRhby12b3RpbmctY3c0XzE3MzAyMjQ4NDUyNzEiLCJtc2ciOiJleUpuY205MWNGOWpiMjUwY21GamRDSTZleUp1WlhjaU9uc2lZM2MwWDJkeWIzVndYMk52WkdWZmFXUWlPak1zSW1sdWFYUnBZV3hmYldWdFltVnljeUk2VzNzaVlXUmtjaUk2SW1OdmMyMXZjekV5Ykd0bGJYQTNjbTVuY0RkcmFtVmtOR1oxZDNkclpYWTBablowYkRoM1oyeHRhalU0YlNJc0luZGxhV2RvZENJNk1YMWRmWDE5IiwiZnVuZHMiOltdfX0=",
    "label": "DAO DAO DAO (1730224848354)",
    "salt": "UGVjN0pRZmF4dlRMN1ozcTcwZmt0"
  }
}));

watch(contractAddress, async (newValue) => {
  if (!newValue) {
    return;
  }
  
  const client2 = await CosmWasmClient.connect(rpcEndpoint);
  
  contract.value = await client2.getContract(newValue);
}, {
  immediate: true,
})

onMounted(() => {
  if (!window.keplr) {
    status.value = {
      type: 'error',
      message: 'Keplr не найден',
    };
  }
});

const executeContract = async () => {
  if (!window.keplr) return;
  
  const gasPrice = GasPrice.fromString("0.0025uatom");
  
  const chainId = "cosmoshub-4";
  await window.keplr.enable(chainId);
  const offlineSigner = window.getOfflineSigner(chainId);
  const client = await SigningCosmWasmClient.connectWithSigner(
    "https://cors.standoffarena.com/https://cosmos-rpc.publicnode.com:443",
    offlineSigner, {
      gasPrice,
    },
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
      type: 'success',
      message: `Результат выполнения контракта: ${JSON.stringify(result)}`
    }
  } catch (error) {
    status.value = {
      type: 'error',
      message: `Ошибка выполнения контракта: ${error.message}`,
    };
    console.error("Ошибка выполнения контракта:", error);
  }
};
</script>
