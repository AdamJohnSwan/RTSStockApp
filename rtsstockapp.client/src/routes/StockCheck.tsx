import { useState } from 'react';
import { StockResponse } from '../api/StockResponse';
import { getApiError } from '../helpers/getApiError';
import { authFetch } from '../helpers/authFetch';

async function getCurrentStockPrice(stockSymbol: string) {
    const response = await authFetch(`api/v1/stock/${stockSymbol}`);
    if (!response.ok) {
        const err = await getApiError(response);
        throw err;
    }
    const data = await response.json() as StockResponse;
    return data;
}

export function StockCheck() {
    const [stockSymbol, setStockSymbol] = useState('');
    const [currentStockPrice, setCurrentStockPrice] = useState<number | undefined>(undefined);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<Error | undefined>(undefined);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!stockSymbol) {
            return;
        }
        setIsFetching(true);
        setError(undefined);
        try {
            const response = await getCurrentStockPrice(stockSymbol);
            setCurrentStockPrice(response.current);
        }
        catch (err) {
            setError(err as Error);
        }
        finally {
            setIsFetching(false);
        }
    }

    return (
        <div>
            <h1>Stock Price Finder</h1>
            <form onSubmit={onSubmit}>
                <input type="text" value={stockSymbol} onChange={(e) => setStockSymbol(e.target.value)} />
                <button disabled={isFetching || !stockSymbol} type="submit">
                    {isFetching ? <span className="spinner"></span> : "Get Stock Price"}
                </button>
                <p>Current price: {currentStockPrice}</p>
                <div className="error">
                    {error?.message}
                </div>
            </form>
        </div>
    );

}