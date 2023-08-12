import React, { Ref, forwardRef, useDeferredValue, useEffect, useImperativeHandle, useRef, useState } from "react"
import LocaleNumber from "../utilities/LocaleNumber"

type CurrencyFieldProps = {
    locale?: string,
    currency?: string,
    decimals?: number,
    max?: number,
    min?: number,
    onNumericalChange?: (newValue: number) => void,
    onMaxFails?: (newValue: boolean) => void,
    onMinFails?: (newValue: boolean) => void
} & React.InputHTMLAttributes<HTMLInputElement>

const CurrencyField = forwardRef(({currency = '$', decimals = 2, max = 999999999, min = 0, ...props}: CurrencyFieldProps, ref: Ref<HTMLInputElement>) => {
    const inputField = useRef<HTMLInputElement>(null);
    const prevPosition = useRef<number>(0);
    const [forceCursor, setForceCursor] = useState<boolean>(false);
    useImperativeHandle(ref, () => inputField.current as HTMLInputElement);

    const locale = new LocaleNumber(props.locale);
    const decimalSeparator = locale.getDecimalSeparator();

    // Formats the initial number given to the component and triggers and onInput event to complete the update
    // and checks the other attributes
    useEffect(() => {
        if (inputField.current && props.value) {
            let newNumber = locale.cleanNumber(inputField.current.value);

            if (newNumber < min) {
                newNumber = min;
            }

            inputField.current.value = inputField.current.value.length
                ? locale.getFormattedValue(newNumber, decimals) : '';
            inputField.current.dispatchEvent(new Event('input', { bubbles: true }));
        }

        if (max <= min) {
            console.warn(`CurrencyField: "max" attribute cannot be smaller or equal to "min" attribute (found max: ${max}, min: ${min})`);
        }
    }, [])

    // Whenever "forceCursor" changes, a new setting of the keyboard cursor should be made
    useEffect(() => {
        if (!inputField.current) {
            return;
        }

        inputField.current.selectionStart = inputField.current.selectionEnd = prevPosition.current;
    }, [forceCursor])

    let prevString = useDeferredValue<string | undefined>(props.value ? props.value.toString() : '');
    const preventFormatting = useRef<boolean>(false);

    // Establishes whether the logic of the next onInput event should prevent formatting the value
    const onKeyDownFunction = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!inputField.current) {
            return;
        }

        const selectionStart = inputField.current.selectionStart ?? 0;
        const decimalSepPos = inputField.current.value.indexOf(decimalSeparator);

        preventFormatting.current
            = (
                (
                    (
                        e.key === decimalSeparator && decimalSepPos === -1
                        || e.key === 'Backspace' && decimalSepPos > -1
                    ) || (
                        !isNaN(Number(e.key))
                        && decimalSepPos > -1
                        && selectionStart > decimalSepPos
                    )
                )
                && decimals > 0
                && selectionStart === inputField.current.value.length
                && inputField.current.value.length > 0
            );
        
    }

    const onInputFunction = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!inputField.current) {
            return;
        }

        // Checks whether it should not format the input value
        if (preventFormatting.current) {
            const [integerNumber, newNumberDecimals] = inputField.current.value.split(decimalSeparator);
            if (newNumberDecimals !== undefined && newNumberDecimals.length > decimals) {
                inputField.current.value = integerNumber + decimalSeparator + newNumberDecimals.slice(0, -1);
            }

            if (props.onChange) {
                props.onChange(e);
            } else {
                prevPosition.current = prevPosition.current - 1;
            }

            // Updates the numerical value
            if (props.onNumericalChange) {
                props.onNumericalChange(locale.cleanNumber(inputField.current.value));
            }

            return;
        }

        prevPosition.current = inputField.current.selectionStart ?? 0;

        // Checks whether the new number exceeds the maximum limit
        const newNumber = locale.cleanNumber(inputField.current.value);
        if (max > min && newNumber > max) {
            if (props.onMaxFails) {
                props.onMaxFails(true);
            }

            setForceCursor(!forceCursor);

            if (!props.onChange) {
                inputField.current.value = prevString ?? ''
                inputField.current.selectionStart = inputField.current.selectionEnd = prevPosition.current - 1;
            } else {
                prevPosition.current = prevPosition.current - 1;
            }

            return;
        } else {
            if (props.onMaxFails) {
                props.onMaxFails(false);
            }

            // Checks whether the new number doesn't reach the minimum limit
            if (newNumber < min) {
                if (props.onMinFails) {
                    props.onMinFails(true);
                }
            } else {
                if (props.onMinFails) {
                    props.onMinFails(false);
                }
            }
        }

        // Formats the new value string as currency
        inputField.current.value = inputField.current.value.length
            ? locale.getFormattedValue(newNumber, decimals) : '';
        

        // Calculates the difference between previous and next value string
        const prevOffset = prevString ? prevString.length : 0;
        const newOffset = inputField.current.value.length;
        const difference = prevOffset - newOffset;

        // Updates the value bound to the field, or manually updates the new previous value string
        if (props.onChange) {
            props.onChange(e);
        } else {
            prevString = inputField.current.value;
        }

        // Updates the numerical value
        if (props.onNumericalChange) {
            props.onNumericalChange(newNumber);
        }

        // Adjusts keyboard's cursor in the field
        if (Math.abs(difference) === 2 && prevPosition.current - 1 > 0) {
            const newPosition = difference > 0 ? prevPosition.current - 1 : prevPosition.current + 1;
            inputField.current.selectionStart = inputField.current.selectionEnd = newPosition;
        } else {
            inputField.current.selectionStart = inputField.current.selectionEnd = prevPosition.current;
        }
    }

    return (
        <div className="react-currency-field-wrapper">
            <span>{currency}</span>
            <input type="text"
                ref={inputField}
                id="initialAmount"
                placeholder={props.placeholder}
                value={props.value}
                onKeyDown={onKeyDownFunction}
                onInput={onInputFunction}
                className="!pl-7"
            />
        </div>
    )
})

export default CurrencyField