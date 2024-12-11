<script setup lang="ts">
import { StargateClient } from "@cosmjs/stargate";
import { useRuntimeConfig } from "#app";
import {Tx} from "cosmjs-types/cosmos/tx/v1beta1/tx";

const parseTransaction = (tx: Uint8Array) => {
  const decodedTx = Tx.decode(tx);
  const body = decodedTx.body;
  
  const messages = body.messages.map(msg => msg.typeUrl);
  
  return {
    height: decodedTx?.height,
    messages,
    hash: decodedTx?.id,
  };
};

const config = useRuntimeConfig();
const client = await StargateClient.connect(config.public.rpcEndpoint);

const latestBlockWithTxs = await client.getBlock();
const transactions = latestBlockWithTxs.txs;

const parsedTransactions = transactions.map(tx => parseTransaction(tx));

const searchQuery = ref("");
const searchResult = ref(null);

const searchTransaction = async () => {
  searchResult.value = await client.getTx(searchQuery.value);
};

const toObject = (val) => {
  return JSON.parse(JSON.stringify(val, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value // return everything else unchanged
  ));
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
      <v-card-title>Transactions in Latest Block ({{ transactions.length }})</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item-group v-if="parsedTransactions && parsedTransactions.length > 0">
            <v-list-item v-for="(tx, index) in parsedTransactions" :key="index">
              <v-list-item-content>
                <v-list-item-title>
                  Transaction {{ index + 1 }}: {{ tx.messages.join(', ') }}
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
        
        <code>
          {{ toObject(searchResult) }}
        </code>
      </v-card-text>
    </v-card>
  </v-container>
</template>
