<script setup lang="ts">
import { computed } from 'vue';
import { useCurrencyStore } from '@/stores/currency';
import moment from 'moment';

/** Props types for the ResultsView component */
interface Props {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
}

/** Props for the ResultsView component */
const props = defineProps<Props>();

/** Use the currency store */
const currencyStore = useCurrencyStore();

/** fromToRate computed property to return the rate from 'from' to 'to' currency */
const fromToRate = computed(() => {
  return currencyStore.getRate(props.fromCurrency, props.toCurrency);
});

/** toFromRate computed property to return the rate from 'to' to 'from' currency */
const toFromRate = computed(() => {
  return currencyStore.getRate(props.toCurrency, props.fromCurrency);
});

/** formattedDate computed property to return the current date and time formatted
 *  And we can easily change the format. For instance for translations
 * */
const formattedDate = computed(() => {
  return moment().format('DD-MM-YYYY HH:mm');
});
</script>

<template>
  <a-card class="results-card" :bordered="true">
    <a-flex vertical :gap="10">
      <a-flex justify="space-between" align="center" class="result-line">
        <div class="exchange-rate">
          {{ props.fromCurrency }}/{{ props.toCurrency }}
        </div>
        <div class="rate-and-date">
          <span class="rate">{{ fromToRate }}</span>
          <span class="date-time"> on {{ formattedDate }}</span>
        </div>
      </a-flex>
      <a-flex justify="space-between" align="center" class="result-line">
        <div class="exchange-rate">
          {{ props.toCurrency }}/{{ props.fromCurrency }}
        </div>
        <div class="rate-and-date">
          <span class="rate">{{ toFromRate }}</span>
          <span class="date-time"> on {{ formattedDate }}</span>
        </div>
      </a-flex>
    </a-flex>
  </a-card>
</template>

<style scoped>

</style>
