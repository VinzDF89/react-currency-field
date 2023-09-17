import CurrencyFieldProps from "../types/CurrencyFieldProps";

const setSymbolPositioningOptimizations = (inputField: HTMLInputElement, position: string): void => {
    if (!inputField || inputField.hasAttribute('data-currency-positioned')) return;

    inputField.setAttribute('data-currency-positioned', 'true');

    const wrapper = inputField.parentElement as HTMLElement;
    const currency = wrapper!.querySelector('span') as HTMLElement;
    const currencyOffset = currency!.offsetWidth + Number(window.getComputedStyle(inputField).getPropertyValue('padding-left').slice(0, -2)) * 2;
    const inputPadding = currency!.offsetWidth + Number(window.getComputedStyle(inputField).getPropertyValue('padding-left').slice(0, -2)) * 3;

    currency.style.display = 'inline-block';
    
    if (position === 'start') {
        wrapper.style.marginLeft = `-${currency!.offsetWidth}px`;
        currency.style.transform = `translateX(${currencyOffset}px)`;
        inputField.style.paddingLeft = `${inputPadding}px`;
    } else if (position === 'end') {
        currency.style.transform = `translateX(-${currencyOffset}px)`;
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