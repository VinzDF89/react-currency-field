import { CurrencyFieldProps } from "../types/CurrencyFieldProps";

const setSymbolPositioningOptimizations = (inputField: HTMLInputElement, position: string): void => {
    if (!inputField) return;

    const wrapper = inputField.parentElement as HTMLElement;
    const currency = wrapper!.querySelector('span') as HTMLElement;
    const inputPadding = currency!.offsetWidth + 15;

    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-flex';

    inputField.style.boxSizing = 'border-box';

    currency.style.display = 'flex';
    currency.style.alignItems = 'center';
    currency.style.position = 'absolute';
    currency.style.height = '100%';
    
    if (position === 'start') {
        currency.style.left = `10px`;
        currency.style.right = '';
        inputField.style.paddingLeft = `${inputPadding}px`;
        inputField.style.paddingRight = '';
    } else if (position === 'end') {
        currency.style.left = '';
        currency.style.right = `10px`;
        inputField.style.paddingLeft = '';
        inputField.style.paddingRight = `${inputPadding}px`;
    }
}

const getSymbolTag = (props: CurrencyFieldProps): React.ReactNode => {
    const symbol = props.currency && props.currency.length ? props.currency : props.symbol;

    return symbol && symbol.length && <span>{symbol}</span>;
}

export {
    setSymbolPositioningOptimizations,
    getSymbolTag
}