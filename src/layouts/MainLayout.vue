<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black q-px-lg">
      <q-toolbar>
        <q-icon
          style="cursor: pointer"
          name="svguse:icons.svg#logo"
          size="md"
          @click="router.push('/')"
        />
        <q-toolbar-title> Multi Channel Player </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
