<template>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-100 uppercase bg-gray-700 dark:bg-gray-900 dark:text-gray-200 bg-secondary-subtle">
          <tr>
            <th scope="col" class="px-4 py-3 min-w-[100px]">
              CCCD
            </th>
            <th scope="col" class="px-4 py-3 min-w-[100px]">
              Tên bệnh nhân
            </th>
            <th scope="col" class="px-4 py-3 min-w-[100px]">
              Giới tính
            </th>
            <th scope="col" class="px-4 py-3 min-w-[100px]">
              Ngày sinh
            </th>
            <th scope="col" class="px-4 py-3 min-w-[120px]">
              Địa chỉ
            </th>
          </tr>
        </thead>
        <tbody id="tbbody">
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-600">
            <th scope="row" class="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              123456789
            </th>
            <td class="px-4 py-4">
              Nguyễn Văn A
            </td>
            <td class="px-4 py-4">
              Nam
            </td>
            <td class="px-4 py-4">
              01/01/1990
            </td>
            <td class="px-4 py-4">
              Hà Nội
            </td>
          </tr>
          <tr class="bg-gray-100 border-b dark:bg-gray-700 dark:border-gray-600">
            <th scope="row" class="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              987654321
            </th>
            <td class="px-4 py-4">
              Trần Thị B
            </td>
            <td class="px-4 py-4">
              Nữ
            </td>
            <td class="px-4 py-4">
              15/05/1985
            </td>
            <td class="px-4 py-4">
              TP.HCM
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
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
    border-bottom: 2px solid #d1d5db; /* Viền dưới đậm cho thead */
  }
  
  .dark thead tr {
    border-bottom: 2px solid #6b7280; /* Viền dưới cho dark mode */
  }
  
  tbody tr {
    border-bottom: 1.5px solid #e5e7eb; /* Viền dưới cho hàng */
  }
  
  .dark tbody tr {
    border-bottom: 1.5px solid #4b5563; /* Viền dưới cho dark mode */
  }
  
  /* Áp dụng hover cho tbody */
  tbody tr:hover {
    background-color: #e5e7eb !important; /* Màu hover tương đương gray-200 */
    transition: background-color 0.3s ease !important;
  }
  
  .dark tbody tr:hover {
    background-color: #4b5563 !important; /* Màu hover cho dark mode */
  }
  
  @media (max-width: 640px) {
    th,
    td {
      padding: 0.5rem;
    }
  }
  </style>