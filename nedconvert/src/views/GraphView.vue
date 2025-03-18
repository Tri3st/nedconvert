<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useCurrencyStore } from "../stores/currency";
import { useMessageStore } from "../stores/message";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const props = defineProps<{
  currency: string;
}>();

const currencyStore = useCurrencyStore();
const messageStore = useMessageStore();
const chartRef = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<Chart | null>(null);

const createChart = (labels: string[], data: number[]) => {
  if (chartRef.value) {
    const ctx = chartRef.value.getContext("2d");
    if (ctx) {
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }
      chartInstance.value = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: `Exchange Rate (vs EUR)`,
              data: data,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
            },
          },
        },
      });
    }
  }
};

const updateChart = () => {
  if (currencyStore.history && Object.keys(currencyStore.history).length > 0) {
    const historyData = currencyStore.history;
    const labels = Object.keys(historyData).sort();
    const data = labels.map((date) => historyData[date][props.currency]);
    createChart(labels, data);
  }
};

watch(
    () => currencyStore.history,
    () => {
      updateChart();
    },
    { deep: true }
);

watch(
    () => props.currency,
    () => {
      fetchHistory();
    }
);

const fetchHistory = async () => {
  try {
    await currencyStore.getCurrencyHistory("EUR", props.currency);
  } catch (error: any) {
    messageStore.show(error.message, "warning");
  }
};

onMounted(async () => {
  try {
    await currencyStore.fetchRates();
  } catch (error: any) {
    messageStore.show(error.message, "warning");
  }
  await fetchHistory();
});
</script>

<template>
  <div class="graph-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<style scoped>
.graph-container {
  width: 100%;
  height: 300px;
}
</style>