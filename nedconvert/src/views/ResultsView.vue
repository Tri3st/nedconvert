<script setup lang="ts">
import { computed } from 'vue';
import { useCurrencyStore } from '@/stores/currency';
import moment from 'moment';

interface Props {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
}

const props = defineProps<Props>();

const currencyStore = useCurrencyStore();

const fromToRate = computed(() => {
  return currencyStore.getRate(props.fromCurrency, props.toCurrency);
});

const toFromRate = computed(() => {
  return currencyStore.getRate(props.toCurrency, props.fromCurrency);
});

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
