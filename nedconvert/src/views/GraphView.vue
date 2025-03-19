<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useCurrencyStore } from "../stores/currency";
import { useMessageStore } from "../stores/message";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

/** currency (string, required): The currency code ("USD" or "JPY") for which to display the exchange rate history
 *  TODO we probably need an additional prop, when we also want to change the base currency.
 * */
const props = defineProps<{
  currency: string;
}>();

/** Our currency store */
const currencyStore = useCurrencyStore();

/** Our message store. Here we set what to show in the modal */
const messageStore = useMessageStore();

/** a ref to the canvas element where the chart is rendered */
const chartRef = ref<HTMLCanvasElement | null>(null);

/** A ref to the chart.js chart instance */
const chartInstance = ref<Chart | null>(null);

/**
 * Creates the new line chart using chart.js
 *
 * @param {string[]} labels Array of date strings for the x-axis
 * @param {number[]} data Array of exchange rate values for the y-axis
 */
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
              /* TODO We are momentarily only converting with respect to the euro. We should use the TO and FROM from
               *  ConvertView.vue */
              label: `Exchange Rate ${props.currency} (vs EUR)`,
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

/** Updates the chart data and redraws it. It's called when the currencyStore.history changes */
const updateChart = () => {
  if (currencyStore.history && Object.keys(currencyStore.history).length > 0) {
    const historyData = currencyStore.history;
    const labels = Object.keys(historyData).sort();
    const data = labels.map((date) => historyData[date][props.currency]);
    createChart(labels, data);
  }
};

/** Watch the currency history and update the chart when it changes */
watch(
    () => currencyStore.history,
    () => {
      updateChart();
    },
    { deep: true }
);

/** Watch the currency and fetch the history when it changes */
watch(
    () => props.currency,
    () => {
      fetchHistory();
    }
);

/** Fetches the exchange rate history for the selected currency from the currencyStore */
const fetchHistory = async () => {
  try {
    await currencyStore.getCurrencyHistory("EUR", props.currency);
  } catch (error: any) {
    messageStore.show(error.message, "warning");
  }
};

/** When the component is mounted, first fetch the rates and then fetch the history */
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