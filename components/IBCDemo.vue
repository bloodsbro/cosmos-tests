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
          Отправить IBC перевод
        </v-btn>
      </v-form>
      <v-alert v-if="transactionResult" type="success" class="mt-4">
        <p>Транзакцію успішно виконано!</p>
        <pre>{{ toObject(transactionResult) }}</pre>
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { sendIBCTransaction } from '@/composables/useIBC';
import { useWalletStore } from "~/stores/wallet";

const toObject = (val) => {
  return JSON.parse(JSON.stringify(val, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value // return everything else unchanged
  ));
}

const useSeed = ref(false);

const status = ref({
  type: 'info',
  message: 'Очікування команди',
});
const walletStore = useWalletStore();
const keplrAddress = computed(() => walletStore.keplrAddress);
const receiveAddress = ref('osmo12wvpkpdp5dc2mz8teerqg0aq75f93w2df8guxh');
const amount = ref(1);
const transactionResult = ref(null);

const handleIBCTransfer = async () => {
  try {
    const result = await sendIBCTransaction(
      keplrAddress.value,
      receiveAddress.value,
      amount.value,
      "cosmoshub-4",
      useSeed.value
    );
    transactionResult.value = result;
    
    /*
    {
  "code": 0,
  "height": 23460646,
  "txIndex": 0,
  "events": [
    {
      "type": "tx",
      "attributes": [
        {
          "key": "acc_seq",
          "value": "cosmos12wvpkpdp5dc2mz8teerqg0aq75f93w2dpumvs9/4"
        }
      ]
    },
    {
      "type": "tx",
      "attributes": [
        {
          "key": "signature",
          "value": "Jz9dcej1CUvtlMOxvVMz3CWbao6Ua3H9bSUJgpi78mUhOkMnY10LMyTPwpPZXrPFT38Wzk7VE8DS1lw3+HS5KA=="
        }
      ]
    },
    {
      "type": "coin_spent",
      "attributes": [
        {
          "key": "spender",
          "value": "cosmos12wvpkpdp5dc2mz8teerqg0aq75f93w2dpumvs9"
        },
        {
          "key": "amount",
          "value": "2000uatom"
        }
      ]
    },
    {
      "type": "coin_received",
      "attributes": [
        {
          "key": "receiver",
          "value": "cosmos13pxn9n3qw79e03844rdadagmg0nshmwf7qvuye"
        },
        {
          "key": "amount",
          "value": "2000uatom"
        }
      ]
    },
    {
      "type": "transfer",
      "attributes": [
        {
          "key": "recipient",
          "value": "cosmos13pxn9n3qw79e03844rdadagmg0nshmwf7qvuye"
        },
        {
          "key": "sender",
          "value": "cosmos12wvpkpdp5dc2mz8teerqg0aq75f93w2dpumvs9"
        },
        {
          "key": "amount",
          "value": "2000uatom"
        }
      ]
    },
    {
      "type": "message",
      "attributes": [
        {
          "key": "sender",
          "value": "cosmos12wvpkpdp5dc2mz8teerqg0aq75f93w2dpumvs9"
        }
      ]
    },
    {
      "type": "message",
      "attributes": [
        {
          "key": "action",
          "value": "/ibc.applications.transfer.v1.MsgTransfer"
        },
        {
          "key": "sender",
          "value": "cosmos12wvpkpdp5dc2mz8teerqg0aq75f93w2dpumvs9"
        },
        {
          "key": "msg_index",
          "value": "0"
        }
      ]
    },
    {
      "type": "coin_spent",
      "attributes": [
        {
          "key": "spender",
          "value": "cosmos12wvpkpdp5dc2mz8teerqg0aq75f93w2dpumvs9"
        },
        {
          "key": "amount",
          "value": "1uatom"
        },
        {
          "key": "msg_index",
          "value": "0"
        }
      ]
    },
    {
      "type": "coin_received",
      "attributes": [
        {
          "key": "receiver",
          "value": "cosmos1x54ltnyg88k0ejmk8ytwrhd3ltm84xehrnlslf"
        },
        {
          "key": "amount",
          "value": "1uatom"
        },
        {
          "key": "msg_index",
          "value": "0"
        }
      ]
    },
    {
      "type": "transfer",
      "attributes": [
        {
          "key": "recipient",
          "value": "cosmos1x54ltnyg88k0ejmk8ytwrhd3ltm84xehrnlslf"
        },
        {
          "key": "sender",
          "value": "cosmos12wvpkpdp5dc2mz8teerqg0aq75f93w2dpumvs9"
        },
        {
          "key": "amount",
          "value": "1uatom"
        },
        {
          "key": "msg_index",
          "value": "0"
        }
      ]
    },
    {
      "type": "message",
      "attributes": [
        {
          "key": "sender",
          "value": "cosmos12wvpkpdp5dc2mz8teerqg0aq75f93w2dpumvs9"
        },
        {
          "key": "msg_index",
          "value": "0"
        }
      ]
    },
    {
      "type": "send_packet",
      "attributes": [
        {
          "key": "packet_data",
          "value": "{\"amount\":\"1\",\"denom\":\"uatom\",\"receiver\":\"osmo12wvpkpdp5dc2mz8teerqg0aq75f93w2df8guxh\",\"sender\":\"cosmos12wvpkpdp5dc2mz8teerqg0aq75f93w2dpumvs9\"}"
        },
        {
          "key": "packet_data_hex",
          "value": "7b22616d6f756e74223a2231222c2264656e6f6d223a227561746f6d222c227265636569766572223a226f736d6f31327776706b706470356463326d7a387465657271673061713735663933773264663867757868222c2273656e646572223a22636f736d6f7331327776706b706470356463326d7a38746565727167306171373566393377326470756d767339227d"
        },
        {
          "key": "packet_timeout_height",
          "value": "0-0"
        },
        {
          "key": "packet_timeout_timestamp",
          "value": "1733902442043000000"
        },
        {
          "key": "packet_sequence",
          "value": "4135421"
        },
        {
          "key": "packet_src_port",
          "value": "transfer"
        },
        {
          "key": "packet_src_channel",
          "value": "channel-141"
        },
        {
          "key": "packet_dst_port",
          "value": "transfer"
        },
        {
          "key": "packet_dst_channel",
          "value": "channel-0"
        },
        {
          "key": "packet_channel_ordering",
          "value": "ORDER_UNORDERED"
        },
        {
          "key": "packet_connection",
          "value": "connection-257"
        },
        {
          "key": "connection_id",
          "value": "connection-257"
        },
        {
          "key": "msg_index",
          "value": "0"
        }
      ]
    },
    {
      "type": "message",
      "attributes": [
        {
          "key": "module",
          "value": "ibc_channel"
        },
        {
          "key": "msg_index",
          "value": "0"
        }
      ]
    },
    {
      "type": "ibc_transfer",
      "attributes": [
        {
          "key": "sender",
          "value": "cosmos12wvpkpdp5dc2mz8teerqg0aq75f93w2dpumvs9"
        },
        {
          "key": "receiver",
          "value": "osmo12wvpkpdp5dc2mz8teerqg0aq75f93w2df8guxh"
        },
        {
          "key": "amount",
          "value": "1"
        },
        {
          "key": "denom",
          "value": "uatom"
        },
        {
          "key": "memo",
          "value": ""
        },
        {
          "key": "msg_index",
          "value": "0"
        }
      ]
    },
    {
      "type": "message",
      "attributes": [
        {
          "key": "module",
          "value": "transfer"
        },
        {
          "key": "msg_index",
          "value": "0"
        }
      ]
    },
    {
      "type": "coin_spent",
      "attributes": [
        {
          "key": "spender",
          "value": "cosmos13pxn9n3qw79e03844rdadagmg0nshmwf7qvuye"
        },
        {
          "key": "amount",
          "value": "1377uatom"
        }
      ]
    },
    {
      "type": "coin_received",
      "attributes": [
        {
          "key": "receiver",
          "value": "cosmos1j7936y5vdvh6c55v07tt05hdmhuz5xu708rpac"
        },
        {
          "key": "amount",
          "value": "1377uatom"
        }
      ]
    },
    {
      "type": "transfer",
      "attributes": [
        {
          "key": "recipient",
          "value": "cosmos1j7936y5vdvh6c55v07tt05hdmhuz5xu708rpac"
        },
        {
          "key": "sender",
          "value": "cosmos13pxn9n3qw79e03844rdadagmg0nshmwf7qvuye"
        },
        {
          "key": "amount",
          "value": "1377uatom"
        }
      ]
    },
    {
      "type": "message",
      "attributes": [
        {
          "key": "sender",
          "value": "cosmos13pxn9n3qw79e03844rdadagmg0nshmwf7qvuye"
        }
      ]
    },
    {
      "type": "fee_pay",
      "attributes": [
        {
          "key": "fee",
          "value": "623uatom"
        }
      ]
    },
    {
      "type": "tip_pay",
      "attributes": [
        {
          "key": "tip",
          "value": "1377uatom"
        },
        {
          "key": "tip_payee",
          "value": "cosmos1j7936y5vdvh6c55v07tt05hdmhuz5xu708rpac"
        }
      ]
    }
  ],
  "rawLog": "",
  "transactionHash": "9D7109534B462B5EFB5DB81636A2375CCB5072FA9E40CC0F76DA5566804119ED",
  "msgResponses": [
    {
      "typeUrl": "/ibc.applications.transfer.v1.MsgTransferResponse",
      "value": {
        "0": 8,
        "1": 253,
        "2": 179,
        "3": 252,
        "4": 1
      }
    }
  ],
  "gasUsed": "145735",
  "gasWanted": "200000"
}
     */
  } catch (error) {
    status.value = {
      type: 'error',
      message: `Помилка під час виконання IBC: ${error.message}.`,
    };
    console.error(error);
  }
};
</script>
