<template>
  <v-container>
    <h1 class="text-center mb-5">Cosmos Blockchain Showcase</h1>
    <v-row>
      <v-col cols="12" md="6" class="mb-3">
        <v-btn block color="primary" :to="{ path: '/explorer' }">
          Explorer
        </v-btn>
      </v-col>
      <v-col cols="12" md="6" class="mb-3">
        <v-btn block color="primary" :to="{ path: '/keplr' }">
          Підключення Keplr
        </v-btn>
      </v-col>
      <v-col cols="12" md="6" class="mb-3">
        <v-btn block color="primary" :to="{ path: '/contract' }">
          Виконання контракту
        </v-btn>
      </v-col>
      <v-col cols="12" md="6" class="mb-3">
        <v-btn block color="primary" :to="{ path: '/ibc' }">
          IBC Demo
        </v-btn>
      </v-col>
      <v-col cols="12" md="6" class="mb-3">
        <v-btn block color="primary" :to="{ path: '/ibc' }">
          NFT demo
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
</script>
