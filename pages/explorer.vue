<script setup lang="ts">
import { getClient, getTransactionData, parseTransaction } from '@/composables/useExplorer';

const client = await getClient();

const latestBlockWithTxs = await client.getBlock();
const transactions = latestBlockWithTxs.txs;

const parsedTransactions = transactions.map(tx => parseTransaction(tx));

const searchQuery = ref("");
const searchResult = ref(null);

const searchTransaction = async () => {
  searchResult.value = await getTransactionData(searchQuery.value)
};

const getDotColor = (type) => {
  switch (type) {
    case 'message':
    case 'execute':
    case 'tx':
    case 'fee_pay':
    case 'tip_pay':
    case 'use_feegrant':
    case 'update_feegrant':
    case 'update_client':
    case 'acknowledge_packet':
    case 'fungible_token_packet':
    case 'write_acknowledgement':
    case 'recv_packet': return 'deep-purple-lighten-1'
    case 'transfer':
    case 'coin_received':
    case 'coin_spent':
    case 'withdraw_rewards': return 'green'
    case 'wasm':
    case 'instantiate':
    case 'reply':
    case 'update_contract_admin': return 'red'
  }
}
</script>

<template>
  <v-container>
    <h1>Blockchain Explorer</h1>
    
    <v-card>
      <v-card-title>Latest Block</v-card-title>
      <v-card-text v-if="latestBlockWithTxs">
        <p><strong>Hash:</strong> {{ latestBlockWithTxs.id }}</p>
        <p><strong>Header:</strong> {{ latestBlockWithTxs.header }}</p>
      </v-card-text>
    </v-card>
    
    <v-card style="margin-top: 25px;">
      <v-card-title>Transactions in Latest Block ({{ transactions?.length ?? 0 }})</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item-group v-if="parsedTransactions && parsedTransactions.length > 0">
            <v-list-item v-for="(tx, index) in parsedTransactions" :key="index">
              <v-list-item-content>
                <v-list-item-title>
                  message actions used: {{ tx.messages }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ tx.hash }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <v-list-item v-else>
            <v-list-item-content>
              <v-list-item-title>No transactions found in the latest block.</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    
    <v-card style="margin-top: 25px;">
      <v-card-title>Search for a Transaction</v-card-title>
      <v-card-text>
        <v-text-field
          label="Enter Transaction Hash"
          v-model="searchQuery"
          @keyup.enter="searchTransaction"
        ></v-text-field>
        <v-btn @click="searchTransaction">Search</v-btn>
        
        <template v-if="searchResult">
          <v-card class="mx-auto mt-2">
            <v-toolbar color="transparent">
              <template v-slot:prepend>
                <v-btn icon="$menu"></v-btn>
              </template>
              
              <v-toolbar-title class="text-h6">
                Транзакція {{ searchResult.hash }} має висоту {{ searchResult.height }} складається з {{ searchResult.events.length }} евентів і завершена з кодом {{ searchResult.code }}
              </v-toolbar-title>
              
              <template v-slot:append>
                <v-btn icon="mdi-dots-vertical"></v-btn>
              </template>
            </v-toolbar>
            
            <v-card-text>
              <div class="font-weight-bold ms-1 mb-2">Евенти транзакції</div>
              
              <v-timeline align="start" density="compact">
                <v-timeline-item
                  v-for="(event, idx) in searchResult.events"
                  :key="idx"
                  :dot-color="getDotColor(event.type)"
                  size="x-small"
                >
                  <div class="mb-4">
                    <div class="font-weight-normal">
                      <strong>{{ event.type }}</strong>
                    </div>
                    
                    <div v-for="desc in event.attributes">
                      {{ desc.key }}: {{ desc.value }} <br />
                    </div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </template>
      </v-card-text>
    </v-card>
  </v-container>
</template>
