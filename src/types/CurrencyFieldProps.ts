import { Ref } from "react";

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
    /**
     * @deprecated Use {@link CurrencyFieldProps.symbol} instead.
     */
    currency?: string,
    symbol?: string,
    symbolPosition?: 'start' | 'end'
    decimals?: number,
    max?: number,
    min?: number,
    disableAutoCurrencyPositioning?: boolean,
    numericalValue?: number,
    onNumericalChange?: (newValue: number) => void,
    onMaxFails?: (newValue: boolean) => void,
    onMinFails?: (newValue: boolean) => void
}

export default CurrencyFieldProps;