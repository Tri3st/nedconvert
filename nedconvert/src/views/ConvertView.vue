<script setup lang="ts">
import GraphView from "@/views/GraphView.vue";
import {computed, reactive } from "vue";
import type {ComputedRef, UnwrapRef} from "vue";
import {useCurrencyStore} from "@/stores/currency.ts";
import ResultView from "@/views/ResultsView.vue";

/** Interface for the currencies type */
interface Currencies {
  value: string;
  label: string;
  symbol: string;
}

/** Interface for the form state
 *  layout: The layout of the form (horizontal, vertical, inline)
 *  selectFrom: the selected 'from' currency code
 *  selectTo: the selected 'to' currency code
 *  fromCurrencies: An array of available 'from' currencies
 *
 *  */
interface FormState {
  layout: "horizontal" | "vertical" | "inline";
  selectFrom: string;
  selectTo: string;
  inputFrom: number;
  inputTo: number;
  fromCurrencies: Currencies[];
  toCurrencies: ComputedRef<Currencies[]>;
}

/** Use our currency store */
const useCurrency = useCurrencyStore();

/** A computed property to return the list of currencies with the selected 'from' currency removed */
const computedToCurrencies: ComputedRef<{ value: string; label: string; symbol: string;}[]> = computed(() => {
  return (
    formState.fromCurrencies.filter(
      (curr) => curr.value !== formState.selectFrom,
    ) || [{ value: "", label: "", symbol: "" }]
  );
});

/** Our formState */
const formState: UnwrapRef<FormState> = reactive<FormState>({
  layout: "horizontal",
  selectFrom: 'EUR',
  selectTo: 'USD',
  inputFrom: 0,
  inputTo: 0,
  fromCurrencies: useCurrency
    .getCurrencies()
    .map((currency) => ({ value: currency.name, label: currency.name, symbol: currency.symbol })),
  toCurrencies: computedToCurrencies
});

const onFinish = () => {
  console.log("Finish!");
};

const onFinishFailed = () => {
  console.log("Finish Failed!");
};

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
  formState.inputFrom = 0.00;
  formState.inputTo = 0.00;
};

const onClick = () => {
  const amount = useCurrency.convert(formState.inputFrom, formState.selectFrom, formState.selectTo) || 0;
  formState.inputTo = Number(amount.toFixed(3));
}

const toSymbol = computed(() => {
  return formState.toCurrencies.find((currency) => currency.value === formState.selectTo)?.symbol;
});

const fromSymbol = computed(() => {
  return formState.fromCurrencies.find((currency) => currency.value === formState.selectFrom)?.symbol
});

</script>

<template>
  <div class="currency-background">
    <a-flex vertical align="center" justify="center" gap="large" class="currency-container">
      <a-card class="currency-card" :bordered="true">
        <a-typography-title class="currency-title">Convert View</a-typography-title>
        <a-form
          :model="formState"
          name="currencyForm"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <a-flex style="width: 100%" :gap="20" :vertical="false" :wrap="true" justify="center">
            <a-flex vertical class="currency-input-container">
              <a-typography-title :level="3" class="currency-input-label">FROM</a-typography-title>
              <a-form-item name="fromCurrency" class="select">
                <a-select
                  v-model:value="formState.selectFrom"
                  style="width: 200px"
                  @change="handleChange"
                >
                  <a-select-option
                    v-for="currency in formState.fromCurrencies"
                    :key="currency.value"
                    :value="currency.value"
                  >{{ currency.label }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item name="fromInput">
                <a-input
                  type="number"
                  id="fromInput"
                  name="fromInput"
                  style="width:200px"
                  v-model:value="formState.inputFrom"
                  :addon-before="fromSymbol"
                  :addon-after="formState.selectFrom"
                />
              </a-form-item>
            </a-flex>
            <a-flex align="center" justify="center">
              <a-button type="primary" size="large" @click="onClick" class="convert-button">CONVERT &gt;</a-button>
            </a-flex>
            <a-flex vertical align="start" class="currency-input-container">
              <a-typography-title :level="3" class="currency-input-label">TO</a-typography-title>
              <a-form-item name="toCurrency" class="select">
                <a-select
                  v-model:value="formState.selectTo"
                  style="width: 200px"
                  @change="handleChange"
                >
                  <a-select-option
                    class="select"
                    v-for="currencyTo in formState.toCurrencies"
                    :key="currencyTo.value"
                    :value="currencyTo.value"
                  >{{ currencyTo.label }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item name="toInput">
                <a-input
                  class="currency-input-readonly"
                  type="number"
                  id="toInput"
                  name="toInput"
                  style="width:200px"
                  v-model:value="formState.inputTo"
                  :addon-before="toSymbol"
                  :addon-after="formState.selectTo"
                  :readonly="true"
                />
              </a-form-item>
            </a-flex>
          </a-flex>
        </a-form>
      </a-card>
      <ResultView
        :fromCurrency="formState.selectFrom"
        :toCurrency="formState.selectTo"
        :fromAmount="formState.inputFrom"
        :toAmount="formState.inputTo"
      />
      <GraphView :currency="formState.selectTo" />
    </a-flex>
  </div>

</template>

<style scoped>
.currency-container{
  margin: 20px;
}
.currency-input-readonly {
  cursor: default;
}
</style>
