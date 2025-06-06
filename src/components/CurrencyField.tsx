import React, { Ref, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { CurrencyFieldProps } from "../types/CurrencyFieldProps"
import LocaleNumber from "../utilities/LocaleNumber"
import { setSymbolPositioningOptimizations, getSymbolTag } from "../utilities/Symbol"

const CurrencyField = forwardRef(({
        symbol = '$',
        symbolPosition = 'start',
        decimals = 2,
        max = 999999999,
        min = 0,
        disableAutoCurrencyPositioning = false,
        disableAutoSymbolPositioning = false,
        numericalValue = 0,
        ...props
    }: CurrencyFieldProps, ref: Ref<HTMLInputElement>) => {

    const inputField = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string>(props.value?.toString() ?? numericalValue.toString());
    const prevPosition = useRef<number>(0);
    const currentPosition = useRef<number>(0);

    const preventFormatting = useRef<boolean>(false);
    const isPasted = useRef<boolean>(false);

    const locale = new LocaleNumber(props.locale);
    const decimalSeparator = locale.getDecimalSeparator();

    useImperativeHandle(ref, () => inputField.current as HTMLInputElement);

    // Forces the cursor to keep the same position or shift it by a number
    const shiftCursor = (position: number, offset = 0) => inputField.current!.selectionStart = inputField.current!.selectionEnd = position - offset;

    const updateStates = (e: React.ChangeEvent<HTMLInputElement> | null = null) => {
        if (!inputField.current) return;

        // Updates the value bound to the field
        e && props.onChange && props.onChange(e);

        // Updates the numerical value
        props.onNumericalChange && props.onNumericalChange(locale.cleanNumber(inputField.current.value));
    }

    // Formats the initial number passed to the component and triggers the onInput event to complete the update
    // It also ensures that any change made to the value externally by directly changing the state is properly formatted
    useEffect(() => {
        max <= min && console.warn(`CurrencyField: "max" attribute cannot be smaller or equal to "min" attribute (found max: ${max}, min: ${min})`);

        let formattedValue = locale.getFormattedValue(props.value ? locale.cleanNumber(props.value) : numericalValue, decimals);
        if (preventFormatting.current && formattedValue === '0') formattedValue = '';

        if (!inputField.current) return;

        props.onNumericalChange && props.onNumericalChange(locale.cleanNumber(formattedValue));
        
        if (!preventFormatting.current) {
            inputField.current.value = formattedValue;
            setInputValue(formattedValue);
        }

        if ((props.value && props.value != formattedValue)) {
            props.onChange && inputField.current.dispatchEvent(new Event('input', { bubbles: true }));
        }
    // eslint-disable-next-line
    }, [props.value, numericalValue])

    // If enabled, it executes the automatic symbol positioning logic
    useEffect(() => {
        if (!inputField.current) return;

        !disableAutoSymbolPositioning && !disableAutoCurrencyPositioning && setSymbolPositioningOptimizations(inputField.current, symbolPosition);
    }, [disableAutoSymbolPositioning, disableAutoCurrencyPositioning, symbolPosition])

    const onPasteFunction = (e: React.ClipboardEvent<HTMLInputElement>) => {
        if (!inputField.current) return;

        isPasted.current = true;

        props.onPaste && props.onPaste(e);
    }

    // Establishes whether the logic of the next onInput event should prevent formatting the value
    const onKeyDownFunction = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!inputField.current) return;

        const selectionStart = inputField.current.selectionStart ?? 0;
        const decimalSepPos = inputField.current.value.indexOf(decimalSeparator);

        preventFormatting.current = (
            (
                (
                    (e.key === decimalSeparator && decimalSepPos === -1) 
                    || ((!isNaN(Number(e.key)) || e.key == 'Backspace' || e.key == 'Delete') && decimalSepPos > -1 && selectionStart > decimalSepPos)
                )
                && decimals > 0
                && selectionStart === inputField.current.value.length
                && inputField.current.value.length > 0
            ) || (e.key == 'Backspace' && selectionStart === 1 || e.key == 'Delete' && selectionStart === 0)
        );

        if (!preventFormatting.current && e.key === decimalSeparator) {
            e.preventDefault();
        } else {
            prevPosition.current = inputField.current.selectionStart ?? 0;
        }
    }

    // Allows to pass a custom onMouseDown event
    const onMouseDownFunction = (e: React.MouseEvent<HTMLInputElement>) => {
        if (!inputField.current) return;

        props.onMouseDown && props.onMouseDown(e);
    }

    // When focused, the value of the field gets entirely selected if the value has only 1 character
    const onFocusFunction = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!inputField.current) return;

        if (inputField.current.value.length === 1) inputField.current.select();

        props.onFocus && props.onFocus(e);
    }

    // Checks whether the value has exceeded the maximum value allowed when losing the focus of the field
    // and in case reset the maximum flag
    const onBlurFunction = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!inputField.current) return;

        const newNumber = locale.cleanNumber(inputField.current.value);
        if (max > min && newNumber <= max) {
            props.onMaxFails && props.onMaxFails(false);
        }

        if (!inputField.current.value.length) {
            inputField.current.value = '0';
        } else if (inputField.current.value.includes(decimalSeparator)) {
            const [integerPart, decimalPart] = inputField.current.value.split(decimalSeparator);
            if (decimalPart.length === 0 || decimalPart.length < decimals) {
                setInputValue(integerPart + decimalSeparator + decimalPart + '0'.repeat(decimals - decimalPart.length));
            }
        }

        props.onBlur && props.onBlur(e);
    }

    const onInputFunction = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!inputField.current) return;

        currentPosition.current = inputField.current.selectionStart ?? 0;

        // Checks whether the new number exceeds the maximum limit
        const newNumber = locale.cleanNumber(inputField.current.value);
        if (max > min && newNumber > max) {
            props.onMaxFails && props.onMaxFails(true);

            shiftCursor(currentPosition.current);

            currentPosition.current = currentPosition.current - 1;

            inputField.current.value = inputValue ?? ''
            inputField.current.selectionStart = inputField.current.selectionEnd = currentPosition.current;

            return;
        } else {
            props.onMaxFails && props.onMaxFails(false);

            // Checks whether the new number doesn't reach the minimum limit
            if (props.onMinFails) {
                newNumber < min && props.onMinFails(true);
                newNumber >= min && props.onMinFails(false);
            }
        }

        // Checks whether it should not format the input value
        if (preventFormatting.current) {
            const [integerNumber, newNumberDecimals] = inputField.current.value.split(decimalSeparator);
            if (newNumberDecimals !== undefined && newNumberDecimals.length > decimals) {
                inputField.current.value = integerNumber + decimalSeparator + newNumberDecimals.slice(0, -1);
            }

            setInputValue(inputField.current.value);
            updateStates(e);

            return;
        }

        // Formats the new value string as currency
        inputField.current.value = inputField.current.value.length
            ? locale.getFormattedValue(newNumber, decimals) : '';

        // Calculates the difference between previous and next value string
        const prevOffset = inputValue ? inputValue.length : 0;
        const newOffset = inputField.current.value.length;
        const difference = prevOffset - newOffset;

        // Update the internal value
        setInputValue(inputField.current.value);

        updateStates(e);

        if (isPasted.current) {
            isPasted.current = false;
        
            return inputField.current.selectionStart = inputField.current.selectionEnd = inputField.current.value.length;
        }

        // Adjusts keyboard's cursor in the field
        if (Math.abs(difference) === 2 && currentPosition.current - 1 > 0) {
            const newPosition = difference > 0 ? currentPosition.current - 1 : currentPosition.current + 1;
            inputField.current.selectionStart = inputField.current.selectionEnd = newPosition;
        } else if (prevPosition.current > currentPosition.current) {
            shiftCursor(prevPosition.current, 1);
        } else {
            shiftCursor(currentPosition.current, (difference === 0 && inputValue.length > 1) ? 1 : 0);
        }
    }

    const symbolTag = getSymbolTag({symbol, ...props});

    return (
        <>
            <div className="react-currency-field-wrapper">
                {symbolPosition === 'start' && symbolTag}
                <input type="text"
                    ref={inputField}
                    id={props.id}
                    name={props.name}
                    placeholder={props.placeholder}
                    value={inputValue}
                    onInput={onInputFunction}
                    onKeyDown={onKeyDownFunction}
                    onMouseDown={onMouseDownFunction}
                    onFocus={onFocusFunction}
                    onBlur={onBlurFunction}
                    onPaste={onPasteFunction}
                    className={props.className}
                />
                {symbolPosition === 'end' && symbolTag}
            </div>
        </>
    )
})

export default CurrencyField