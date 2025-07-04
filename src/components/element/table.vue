<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-100 uppercase bg-gray-700 dark:bg-gray-900 dark:text-gray-200 bg-secondary-subtle">
        <tr>
          <th v-for="col in columns" :key="col.key" scope="col" class="px-4 py-3 min-w-[100px]">
            {{ col.header }}
          </th>
        </tr>
      </thead>
      <tbody id="tbody">
        <tr
          v-for="(row, index) in array && array.list ? array.list : []"
          :key="index"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-600"
          @click="updateActiveIndex(index)"
        >
          <td v-for="col in columns" :key="col.key" class="px-4 py-4">
            {{ row[col.key] || '' }}
          </td>
        </tr>
        <tr v-if="!array || !array.list || array.list.length === 0">
          <td :colspan="columns.length" class="px-4 py-4 text-center">Không có dữ liệu</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  // name: 'DynamicTable',
  props: {
    array: {
      type: Object,
      required: true,
      validator: (data) => {
        return 'list' in data && Array.isArray(data.list);
      },
    },
    columns: {
      type: Array,
      required: true,
      default: () => [],
      validator: (cols) => {
        return cols.every((col) => 'key' in col && 'header' in col);
      },
    },

    patient: {
      type: Object,
      default: {},
    },
  },

  emits: ["update:activeIndex"],

  methods: {
    // Cập nhật index của item được chọn
    updateActiveIndex(index) {
        this.$emit("update:activeIndex", index);
      },
  }

};
</script>

<style scoped>
.relative {
  width: 100%;
  max-width: none;
}

table {
  width: 100% !important;
}

th,
td {
  padding: 0.75rem;
}

thead tr {
  border-bottom: 2px solid #d1d5db;
}

.dark thead tr {
  border-bottom: 2px solid #6b7280;
}

tbody tr {
  border-bottom: 1.5px solid #e5e7eb;
}

.dark tbody tr {
  border-bottom: 1.5px solid #4b5563;
}

tbody tr:hover {
  background-color: #e5e7eb !important;
  transition: background-color 0.3s ease !important;
}

.dark tbody tr:hover {
  background-color: #4b5563 !important;
}

@media (max-width: 640px) {
  th,
  td {
    padding: 0.5rem;
  }
}
</style>