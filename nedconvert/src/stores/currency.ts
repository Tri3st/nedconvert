import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import axios from 'axios';
import moment from 'moment';

export interface Currency {
    name: string;
    symbol: string;
}

interface CurrencyRates {
    [key: string]: number;
}

interface CurrencyHistory {
    [date: string]: {
        [currency: string]: number;
    };
}

interface CurrencyState {
    rates: Ref<CurrencyRates>;
    baseCurrency: Ref<string>;
    loading: Ref<boolean>;
    error: Ref<string | null>;
    history: Ref<CurrencyHistory>;
    historyLoading: Ref<boolean>;
    historyError: Ref<string | null>;
}

type UseCurrencyStoreReturn = CurrencyState & {
    fetchRates: (baseCurrency?: string) => Promise<void>;
    getCurrencies: () => Currency[];
    getRate: (from: string, to: string) => number | undefined;
    convert: (amount: number, from: string, to: string) => number | undefined;
    getCurrencyHistory: (baseCurrency: string, targetCurrency: string) => Promise<void>;
};

const options = {
    method: 'GET',
    baseURL: 'https://currency-conversion-and-exchange-rates.p.rapidapi.com',
    headers: {
        'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
        'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com',
    },
};


export const useCurrencyStore = defineStore('currency', (): UseCurrencyStoreReturn => {
    const targetCurrencies: Currency[] = [{name: 'EUR', symbol: '€'}, {name:'USD', symbol: '$'}, {name: 'GBP', symbol: '£'}, {name: 'INR', symbol:'₹'}, {name: 'JPY', symbol: '¥'}, {name: 'AUD', symbol: 'A$'}]; // Added Australian Dollar (AUD) as the 6th currency
    const rates: Ref<CurrencyRates> = ref({});
    const baseCurrency: Ref<string> = ref('EUR'); // Default base currency
    const loading: Ref<boolean> = ref(false);
    const error: Ref<string | null> = ref(null);
    const history: Ref<CurrencyHistory> = ref({});
    const historyLoading: Ref<boolean> = ref(false);
    const historyError: Ref<string | null> = ref(null);

    const fetchRates = async (newBaseCurrency?: string) => {
        loading.value = true;
        error.value = null;
        const currentBaseCurrency = newBaseCurrency || baseCurrency.value;
        try {
            const response = await axios.request({
                ...options,
                url: '/latest',
                params: {
                    from: currentBaseCurrency,
                    to: targetCurrencies.filter(currency => currency.name !== currentBaseCurrency).map(currency => currency.name).join(','),
                },
            });

            if (response.data.rates) {
                rates.value = response.data.rates;
                baseCurrency.value = currentBaseCurrency;
                // db_post(currentBaseCurrency, response.data.rates);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch currency rates';
            throw new Error(`Failed to fetch currency rates : ${err.message}`);
        } finally {
            loading.value = false;
        }
    };

    const getCurrencies = () => {
        return targetCurrencies;
    }

    const getRate = (from: string, to: string): number | undefined => {
        if (from === to) {
            return 1;
        }
        if (from === baseCurrency.value) {
            return rates.value[to];
        }
        if (to === baseCurrency.value) {
            return 1 / (rates.value[from] || 1)
        }
        return (1 / (rates.value[from] || 1)) * (rates.value[to] || 1)
    };

    const convert = (amount: number, from: string, to: string): number | undefined => {
        if (from === to) {
            return amount;
        }

        const rate = getRate(from, to);

        if (rate === undefined) {
            return undefined;
        }
        return amount * rate;
    };

    const getCurrencyHistory = async (baseCurrency: string, targetCurrencyInput: string) => {
        historyLoading.value = true;
        historyError.value = null;
        const endDate = moment();
        /* For now we choose one week. We can expand this, to make the user choose (week,month, etc) */
        const startDate = moment().subtract(7, 'days');
        try {
            const response = await axios.request({
                ...options,
                url: '/timeseries',
                params: {
                    start_date: startDate.format('YYYY-MM-DD'),
                    end_date: endDate.format('YYYY-MM-DD'),
                    from: baseCurrency,
                    to: targetCurrencyInput,
                },
            });
            if (response.data.rates) {
                history.value = response.data.rates;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err: any) {
            historyError.value = err.message || 'Failed to fetch currency history';
            throw new Error(`Failed to fetch currency history : ${err.message}`);
        } finally {
            historyLoading.value = false;
        }
    };

    return {
        rates,
        baseCurrency,
        loading,
        error,
        fetchRates,
        getCurrencies,
        getRate,
        convert,
        history,
        historyLoading,
        historyError,
        getCurrencyHistory
    };
});