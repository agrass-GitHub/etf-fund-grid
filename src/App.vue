<template>
  <NThemeEditor>
    <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
      <GridTable></GridTable>
    </NConfigProvider>
  </NThemeEditor>

</template>

<script setup>
import { NConfigProvider, zhCN, dateZhCN, NThemeEditor } from "naive-ui";
import GridTable from "./components/GridTable.vue";

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md
</script>
