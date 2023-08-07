import { useState } from 'react'
import CurrencyField from './components'

function App() {
  const [amount, setAmount] = useState<string>("5'000");

  function changeAmount(e: React.FormEvent<HTMLInputElement>) {
    setAmount(e.currentTarget.value);
  }

  return (
    <>
        <CurrencyField value={amount} onChange={changeAmount} />
        <p>Current value is: {amount}</p>
    </>
  )
}

export default App
