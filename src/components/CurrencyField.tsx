import React, { Ref, forwardRef, useDeferredValue, useEffect, useImperativeHandle, useRef } from "react"
import LocaleNumber from "../utilities/LocaleNumber"

type CurrencyFieldProps = {
    locale?: string,
    currency?: string,
    decimals?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const CurrencyField = forwardRef(({
        currency = '$',
        decimals = '2',
        ...props
    }: CurrencyFieldProps, ref: Ref<HTMLInputElement>) => {
    const inputField = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputField.current as HTMLInputElement);

    const locale = new LocaleNumber(props.locale);
    const decimalSeparator = locale.getDecimalSeparator();

    useEffect(() => {
        if (inputField.current && props.value) {
            const newNumber = locale.cleanNumber(inputField.current.value);
            inputField.current.value = inputField.current.value.length
                ? locale.getFormattedValue(newNumber, Number(decimals)) : '';
            inputField.current.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }, [])

    let prevString = useDeferredValue<string | undefined>(props.value ? props.value.toString() : '');
    const preventFormatting = useRef<boolean>(false);

    const onKeyDownFunction = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!inputField.current) {
            return;
        }

        preventFormatting.current
            = (
                e.key === decimalSeparator
                && Number(decimals) > 0 
                && inputField.current!.selectionStart === inputField.current!.value.length
                && inputField.current.value.length > 0
            );
    }

    const onInputFunction = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (preventFormatting.current) {
            if (props.onChange) {
                props.onChange(e);
            }

            return;
        }

        if (inputField.current) {
            const prevPosition = inputField.current.selectionStart ?? 0;

            const newNumber = locale.cleanNumber(inputField.current.value);
            inputField.current.value = inputField.current.value.length
                ? locale.getFormattedValue(newNumber, Number(decimals)) : '';
            
            const prevOffset = prevString ? prevString.length : 0;
            const newOffset = inputField.current.value.length;
            const difference = prevOffset - newOffset;
            if (props.onChange) {
                props.onChange(e);
            } else {
                prevString = inputField.current.value;
            }

            if (Math.abs(difference) === 2 && prevPosition - 1 > 0) {
                const newPosition = difference > 0 ? prevPosition - 1 : prevPosition + 1;
                inputField.current.selectionStart = inputField.current.selectionEnd = newPosition;
            } else {
                inputField.current.selectionStart = inputField.current.selectionEnd = prevPosition;
            }
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