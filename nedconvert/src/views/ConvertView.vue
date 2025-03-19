<script setup lang="ts">
import GraphView from "@/views/GraphView.vue";
import {computed, type ComputedRef, reactive, type UnwrapRef} from "vue";
import { useCurrencyStore } from "@/stores/currency.ts";



interface FormState {
  layout: "horizontal" | "vertical" | "inline";
  selectFrom: string;
  selectTo: string;
  inputFrom: 0.00,
  inputTo: 0.00,
  fromCurrencies: { value: string; label: string }[];
  toCurrencies: ComputedRef<{ value: string; label: string }[]>;
}

const onFinish = () => {
  console.log("Finish!");
};

const onFinishFailed = () => {
  console.log("Finish Failed!");
};

const useCurrency = useCurrencyStore();

const computedToCurrencies = computed(() => {
  return (
    formState.fromCurrencies.filter(
      (curr) => curr.value !== formState.selectFrom,
    ) || [{ value: "", label: "" }]
  );
});

const formState: UnwrapRef<FormState> = reactive<FormState>({
  layout: "horizontal",
  selectFrom: 'EUR',
  selectTo: 'USD',
  inputFrom: 0,
  inputTo: 0,
  fromCurrencies: useCurrency
    .getCurrencies()
    .map((currency) => ({ value: currency, label: currency })),
  toCurrencies: computedToCurrencies,
});

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};
</script>

<template>
  <a-flex vertical align="center" justify="center" gap="large">
    <a-typography-title>Convert View</a-typography-title>
    <a-form
      :model="formState"
      name="currencyForm"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-flex>
        <a-flex vertical>
          <a-form-item label="From" name="fromCurrency">
            <a-select
              v-model:value="formState.selectFrom"
              style="width: 120px"
              @change="handleChange"
            >
              <a-select-option
                v-for="currency in formState.fromCurrencies"
                :key="currency.value"
                :value="currency.value"
                :label="currency.label"
                >{{ currency.label }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="From" name="fromInput">
            <input type="number" id="fromInput" name="fromInput" />
          </a-form-item>
        </a-flex>
        <a-flex vertical>
          <a-form-item label="To" name="toCurrency">
            <a-select
              v-model:value="formState.selectTo"
              style="width: 120px"
              @change="handleChange"
            >
              <a-select-option
                v-for="currencyTo in formState.toCurrencies"
                :key="currencyTo.value"
                :value="currencyTo.value"
                :label="currencyTo.label"
                >{{ currencyTo.label }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="To" name="toInput">
            <input type="number" id="toInput" name="toInput" />
          </a-form-item>
        </a-flex>
      </a-flex>
    </a-form>
    <GraphView currency="USD" />
  </a-flex>
</template>

<style scoped></style>
