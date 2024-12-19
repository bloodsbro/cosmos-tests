<template>
  <div>
    <NuxtRouteAnnouncer />
    
    <NuxtLayout>
      <v-app>
        <v-app-bar app color="primary" dark>
          <v-toolbar-title>Cosmos Showcase</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text :to="{ path: '/' }">Головна</v-btn>
          <v-btn text :to="{ path: '/explorer' }">Explorer</v-btn>
          <v-btn text :to="{ path: '/keplr' }">Keplr</v-btn>
          <v-btn text :to="{ path: '/contract' }">Контракти</v-btn>
          <v-btn text :to="{ path: '/ibc' }">IBC Demo</v-btn>
          <v-btn text :to="{ path: '/nft' }">NFT</v-btn>
        </v-app-bar>
        <v-main>
          <NuxtPage />
        </v-main>
      </v-app>
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
</script>
