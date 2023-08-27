import { useState } from 'react'
import Header from './components/Header'
import CurrencyField from './components/CurrencyField'
import FieldDataInfo from './components/FieldDataInfo'
import './App.css'

function App() {
    const initialAmount = 5000;
    const maxLimit = 2000000;
    const minLimit = 1000;

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
        <>
            <Header />

            <div className="container">
                <div>
                    <CurrencyField value={amount} onChange={changeAmount} 
                        onNumericalChange={changeNumericalAmount}
                        locale="en-US"
                        max={maxLimit} min={minLimit} onMaxFails={changeMaxLimitExceeded} onMinFails={changeMinLimitNotReached}
                        className={maxLimitExceeded || minLimitNotReached ? 'redBorder' : ''}
                    />
                    <span className="fieldWarning">
                        {maxLimitExceeded && 'Max limit exceeded!'}
                        {minLimitNotReached && 'Min limit not reached!'}
                    </span>
                </div>
                <FieldDataInfo
                    amount={amount.toString()}
                    numericalAmount={numericalAmount}
                    maxLimit={maxLimit}
                    minLimit={minLimit}
                    maxLimitExceeded={maxLimitExceeded}
                    minLimitNotReached={minLimitNotReached}
                />
            </div>
        </>
    )
}

export default App
