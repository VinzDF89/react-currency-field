# React Currency Field

This package provides a React component with an input field to be used in React projects,
where the value directly typed by the user is automatically formatted in the local or in a specific currency format.

## Installation
```
npm i @vinzdf89/react-currency-field
```

## Example

A simple usage of this component would be:

```ts
import { useState } from 'react'
import CurrencyField from './components/CurrencyField'

function App() {
    const initialAmount = 5000;

    const [amount, setAmount] = useState<string | number>(initialAmount);
    const [numericalAmount, setNumericalAmount] = useState<number>(initialAmount);

    function changeAmount(e: React.FormEvent<HTMLInputElement>) {
        setAmount(e.currentTarget.value);
    }

    function changeNumericalAmount(newValue: number) {
        setNumericalAmount(newValue);
    }

    return (
        <>
            <CurrencyField value={amount} onChange={changeAmount} onNumericalChange={changeNumericalAmount} />
            <p>String value: {amount}</p>
            <p>Numerical value: {numericalAmount}</p>
        </>
    )
}

export default App;
```

A more complex example can be found in the App.tsx file of this package.

## Attributes / Properties

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| **ref** | Ref\<HTMLInputElement\> | null | Used for binding a Ref object to the input field. |
| **id** | string | null | For setting the standard HTML "id" attribute. |
| **name** | string | null | For setting the standard HTML "name" attribute. |
| **value** | string \| number | null | Useful for setting a default value, this should be a value provided by a "useState" hook. It can be a number or a string (which has to comply with the local format set!). Number is recommended. |
| **placeholder** | string | null | For setting the standard HTML "placeholder" attribute. |
| **onChange** | (e: React.ChangeEvent<HTMLInputElement>) => void | null | For setting a custom event handler on "change" event, which should update the state passed to the "value" attribute. Look at the example above. |
| **onBlur** | (e: React.FocusEvent<HTMLInputElement>) => void | null | For setting a custom event handler on "blur" event, which will be executed after the internal handler has run. |
| **onPaste** | (e: React.ClipboardEvent<HTMLInputElement>) => void | null | For setting a custom event handler on "paste" event, which will be executed after the internal handler has run. |
| **className** | string | null | Used to set classes to the input field. |
| **locale** | string | null | Set the number format. If the attribute is not provided, the format will be fetched from the browser's language preferences. If even this fails, it will be set to 'en-US'. |
| **currency** | string | '$' | Set the currency symbol to use. |
| **decimals** | number | 2 | Number of decimals allowed. |
| **max** | number | 999999999 | The input field will not allow a value that is greater than the one specified by this attribute, and it will call the function (if any) specified by the "onMaxFails" attribute. |
| **min** | number | 0 | If a value to this attribute is provided and it's greater than zero, any value will be allowed in the input field, but in case it's lower than the one specified by this attribute, it will call the function (if any) specified by the "onMinFails" attribute. |
| **disableAutoCurrencyPositioning** | boolean | false | By default the currency symbol will be translated to the right, so that it will be graphically shown up like it is inside the input field. If set to true, the chosen currency symbol will not be moved, so that the developer would have more freedom to style the component. |
| **onNumericalChange** | (newValue: number) => void | null | Whenever the user interacts with the input field, the function passed to this attribute will be called and it will contain a parameter representing the value of the field but of number type. |
| **onMaxFails** | (newValue: boolean) => void | null | If set, the function will be called every time the user tries to set a number greater than the one specified by the "max" attribute. |
| **onMinFails** | (newValue: boolean) => void | null | If set, the function will be called every time the user interacts with the input field, and its value is lower than the one specified by the "min" attribute. |
