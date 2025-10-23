<template>
  <div :class="['card', 'shadow-sm', 'mb-4', colorClass]">
    <div class="card-body">
      <div class="d-flex align-items-center">
        <div class="icon-circle me-3">
          <slot name="icon"></slot>
        </div>
        <div>
          <h6 class="card-subtitle mb-2 text-muted text-uppercase">{{ title }}</h6>
          <h4 class="card-title fw-bold">{{ value }}</h4>
          <p v-if="description" class="card-text text-sm">{{ description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardWidget',
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'primary', // primary, success, danger, warning, info
    },
  },
  computed: {
    colorClass() {
      return `widget-${this.color}`;
    }
  }
};
</script>

<style scoped>
.card {
  border: none;
  border-left: 0.25rem solid;
}
.widget-primary { border-color: #007bff; }
.widget-success { border-color: #28a745; }
.widget-danger { border-color: #dc3545; }
.widget-warning { border-color: #ffc107; }
.widget-info { border-color: #17a2b8; }

.card-body {
  padding: 1.25rem;
}

.icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #6c757d; /* Màu icon mặc định */
}

/* Tùy chỉnh màu icon theo widget */
.widget-primary .icon-circle { color: #007bff; background-color: rgba(0, 123, 255, 0.1); }
.widget-success .icon-circle { color: #28a745; background-color: rgba(40, 167, 69, 0.1); }
.widget-danger .icon-circle { color: #dc3545; background-color: rgba(220, 53, 69, 0.1); }
.widget-warning .icon-circle { color: #ffc107; background-color: rgba(255, 193, 7, 0.1); }
.widget-info .icon-circle { color: #17a2b8; background-color: rgba(23, 162, 184, 0.1); }

h6 {
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  font-weight: 700;
}

h4 {
  font-size: 1.75rem;
}

.text-sm {
  font-size: 0.85rem;
}
</style>