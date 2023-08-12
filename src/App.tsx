import { useState } from 'react'
import CurrencyField from './components'

function App() {
    const initialAmount = "5000";
    const maxLimit = 200000;
    const minLimit = 1000;

    const [amount, setAmount] = useState<string>(initialAmount);
    const [numericalAmount, setNumericalAmount] = useState<number>(Number(initialAmount));
    const [maxLimitExceeded, setMaxLimitExceeded] = useState<boolean>(false);
    const [minLimitNotReached, setMinLimitNotReached] = useState<boolean>(false);

    function changeAmount(e: React.FormEvent<HTMLInputElement>) {
        setAmount(e.currentTarget.value);
    }

    function changeNumericalAmount(newValue: number) {
        setNumericalAmount(newValue);
    }

    function changeMaxLimitExceeded(newValue: boolean) {
        setMaxLimitExceeded(newValue);
    }

    function changeMinLimitNotReached(newValue: boolean) {
        setMinLimitNotReached(newValue);
    }

    return (
        <>
            <CurrencyField value={amount} onChange={changeAmount} 
                onNumericalChange={changeNumericalAmount}
                max={maxLimit} min={minLimit} onMaxFails={changeMaxLimitExceeded} onMinFails={changeMinLimitNotReached}
            />
            <p>Current value is: {amount}</p>
            <p>Current numerical value is: {numericalAmount}</p>
            <p>Max limit of {maxLimit} exceeded: {maxLimitExceeded ? 'true' : 'false'}</p>
            <p>Min limit of {minLimit} not reached: {minLimitNotReached ? 'true': 'false'}</p>
        </>
    )
}

export default App
