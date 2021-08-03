<template>
  <div class="page">
    <GridForm></GridForm>
    <GridTable></GridTable>
  </div>
</template>

<script >
import GridTable from "./components/GridTable.vue";
import GridForm from "./components/GridForm.vue";

export default {
  name: "App",
  components: { GridTable, GridForm },
  data() {
    return {};
  },
};
</script>

<style>
.page {
  padding: 10px;
}
</style>