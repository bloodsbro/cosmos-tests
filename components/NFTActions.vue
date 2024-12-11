<template>
  <v-container>
    <v-card>
      <v-card-title>Демонстрация NFT действий</v-card-title>
      <v-card-text>
        <v-btn @click="handleViewNFT" :loading="loading">Просмотреть NFT</v-btn>
        
        <v-alert v-if="result" type="success">{{ result }}</v-alert>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {viewNFT} from "~/utils/nft";

const loading = ref(false);
const result = ref(null);
const error = ref(null);

const handleAction = async (action) => {
  loading.value = true;
  result.value = null;
  error.value = null;
  
  try {
    let res;
    switch (action) {
      case 'view':
        res = await viewNFT('sherpacats', '171');
        break;
    }
    result.value = JSON.stringify(res);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const handleViewNFT = () => handleAction('view');
</script>
