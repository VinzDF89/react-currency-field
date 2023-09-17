import React, { Ref, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import LocaleNumber from "../utilities/LocaleNumber"

type CurrencyFieldProps = {
    // Input attributes
    ref?: Ref<HTMLInputElement>,
    id?: string,
    name?: string,
    value?: string | number,
    placeholder?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void,
    onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void,
    className?: string,

    // Custom attributes
    locale?: string,
    currency?: string,
    decimals?: number,
    max?: number,
    min?: number,
    disableAutoCurrencyPositioning?: boolean,
    numericalValue?: number,
    onNumericalChange?: (newValue: number) => void,
    onMaxFails?: (newValue: boolean) => void,
    onMinFails?: (newValue: boolean) => void
}

const setCurrencyLabelPosition = (inputField?: HTMLInputElement) => {
    if (!inputField || inputField.hasAttribute('data-currency-positioned')) return;

    inputField.setAttribute('data-currency-positioned', 'true');

    const wrapper = inputField.parentElement as HTMLElement;
    const currency = wrapper!.firstElementChild as HTMLElement;
    const currencyOffset = currency!.offsetWidth + Number(window.getComputedStyle(inputField).getPropertyValue('padding-left').slice(0, -2)) * 2;
    const inputPadding = currency!.offsetWidth + Number(window.getComputedStyle(inputField).getPropertyValue('padding-left').slice(0, -2)) * 3;

    wrapper.style.marginLeft = `-${currency!.offsetWidth}px`;
    currency.style.display = 'inline-block';
    currency.style.transform = `translateX(${currencyOffset}px)`;
    inputField.style.paddingLeft = `${inputPadding}px`;
}

const CurrencyField = forwardRef(({
        currency = '$',
        decimals = 2,
        max = 999999999,
        min = 0,
        disableAutoCurrencyPositioning = false,
        ...props
    }: CurrencyFieldProps, ref: Ref<HTMLInputElement>) => {

    const inputField = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string>(props.value?.toString() ?? '');
    const prevPosition = useRef<number>(0);

    const preventFormatting = useRef<boolean>(false);
    const isPasted = useRef<boolean>(false);
    const [forceCursor, setForceCursor] = useState<boolean>(false);
    useImperativeHandle(ref, () => inputField.current as HTMLInputElement);

    const locale = new LocaleNumber(props.locale);
    const decimalSeparator = locale.getDecimalSeparator();

    // Formats the initial number given to the component and triggers and onInput event to complete the update
    // and checks the other attributes
    useEffect(() => {
        if (!inputField.current) return;

        !disableAutoCurrencyPositioning && setCurrencyLabelPosition(inputField.current);

        if (props.value) {
            inputField.current.value = inputField.current.value.length
                ? props.value.toString() : '';
            inputField.current.dispatchEvent(new Event('input', { bubbles: true }));
        } else if (props.numericalValue) {
            inputField.current.value = props.numericalValue.toString();
            inputField.current.dispatchEvent(new Event('input', { bubbles: true }));
        }

        max <= min && console.warn(`CurrencyField: "max" attribute cannot be smaller or equal to "min" attribute (found max: ${max}, min: ${min})`);
    }, [])

    // Whenever "forceCursor" changes, a new setting of the keyboard cursor should be made
    useEffect(() => {
        if (!inputField.current) return;

        inputField.current.selectionStart = inputField.current.selectionEnd = prevPosition.current;
    }, [forceCursor])

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
                (e.key === decimalSeparator && decimalSepPos === -1 || e.key === 'Backspace' && decimalSepPos > -1) 
                || (!isNaN(Number(e.key)) && decimalSepPos > -1 && selectionStart > decimalSepPos)
            )
            && decimals > 0
            && selectionStart === inputField.current.value.length
            && inputField.current.value.length > 0
        );

        if (!preventFormatting.current && e.key === decimalSeparator) {
            e.preventDefault();
        }
    }

    // Checks whether the value has exceeded the maximum value allowed when losing the focus of the field
    // and in case reset the maximum flag
    const onBlurFunction = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!inputField.current) return;

        const newNumber = locale.cleanNumber(inputField.current.value);
        if (max > min && newNumber <= max) {
            props.onMaxFails && props.onMaxFails(false);
        }

        props.onBlur && props.onBlur(e);
    }

    const onInputFunction = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!inputField.current) return;

        prevPosition.current = inputField.current.selectionStart ?? 0;

        // Checks whether the new number exceeds the maximum limit
        const newNumber = locale.cleanNumber(inputField.current.value);
        if (max > min && newNumber > max) {
            props.onMaxFails && props.onMaxFails(true);

            setForceCursor(!forceCursor);

            prevPosition.current = prevPosition.current - 1;

            inputField.current.value = inputValue ?? ''
            inputField.current.selectionStart = inputField.current.selectionEnd = prevPosition.current;

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

            // Update the internal value
            setInputValue(inputField.current.value);

            // Updates the value bound to the field, or change the previous position
            props.onChange && props.onChange(e);

            // Updates the numerical value
            props.onNumericalChange && props.onNumericalChange(locale.cleanNumber(inputField.current.value));

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

        // Updates the value bound to the field, or manually updates the new previous value string
        props.onChange && props.onChange(e);

        // Updates the numerical value
        props.onNumericalChange && props.onNumericalChange(locale.cleanNumber(inputField.current.value));

        if (isPasted.current) {
            isPasted.current = false;
        
            return inputField.current.selectionStart = inputField.current.selectionEnd = inputField.current.value.length;
        }

        // Adjusts keyboard's cursor in the field
        if (Math.abs(difference) === 2 && prevPosition.current - 1 > 0) {
            const newPosition = difference > 0 ? prevPosition.current - 1 : prevPosition.current + 1;
            inputField.current.selectionStart = inputField.current.selectionEnd = newPosition;
        } else if (difference === 0 && inputValue != inputField.current.value && inputValue.length > 1) {
            inputField.current.selectionStart = inputField.current.selectionEnd = prevPosition.current - 1;
        } else {
            inputField.current.selectionStart = inputField.current.selectionEnd = prevPosition.current;
        }
    }

    return (
        <>
            <div className="react-currency-field-wrapper">
                <span>{currency}</span>
                <input type="text"
                    ref={inputField}
                    id={props.id}
                    name={props.name}
                    placeholder={props.placeholder}
                    value={inputValue}
                    onInput={onInputFunction}
                    onKeyDown={onKeyDownFunction}
                    onBlur={onBlurFunction}
                    onPaste={onPasteFunction}
                    className={props.className}
                />
            </div>
        </>
    )
})

export default CurrencyField