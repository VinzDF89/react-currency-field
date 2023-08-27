import { useState } from 'react'
import CurrencyField from './components'
import './App.css'
import LocaleNumber from "./utilities/LocaleNumber"

function App() {
    const initialAmount = 5000;
    const maxLimit = 2000000;
    const minLimit = 1000;
    const locale = new LocaleNumber('en-US');

    const [amount, setAmount] = useState<string | number>(initialAmount);
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
        <div>
            <CurrencyField value={amount} onChange={changeAmount} 
                onNumericalChange={changeNumericalAmount}
                locale="en-US"
                max={maxLimit} min={minLimit} onMaxFails={changeMaxLimitExceeded} onMinFails={changeMinLimitNotReached}
            />
            <p>Current value is: {amount}</p>
            <p>Current numerical value is: {numericalAmount}</p>
            <p>Max limit of {locale.getFormattedValue(maxLimit)} exceeded: <span data-testid="maxFlag">{maxLimitExceeded ? 'true' : 'false'}</span></p>
            <p>Min limit of {locale.getFormattedValue(minLimit)} not reached: <span data-testid="minFlag">{minLimitNotReached ? 'true': 'false'}</span></p>
        </div>
    )
}

export default App
