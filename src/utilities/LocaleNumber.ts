class LocaleNumber
{
    locale: string;

    constructor(locale?: string) {
        this.locale = locale ?? navigator.language ?? 'en-US';
    }

    public getFormattedValue(number: number, decimals = 2): string {
        return Intl.NumberFormat(this.locale, {
            maximumFractionDigits: decimals
        }).format(Number(number.toFixed(decimals + 1).slice(0, -1)));
    }

    public getGroupSeparator(): string {
        return this.getSeparator('group') ?? ',';
    }

    public getDecimalSeparator(): string {
        return this.getSeparator('decimal') ?? '.';
    }

    public cleanNumber(number: string | number): number {
        const separator = typeof number === 'number' ? '.' : this.getDecimalSeparator();
        let [integer, decimal] = number.toString().split(separator);

        integer = integer !== undefined ? integer.replaceAll(/\D/g, '') : '';
        decimal = decimal !== undefined ? decimal.replaceAll(/\D/g, '') : '';
        
        let result = '0';
        if (integer.length && decimal.length) {
            result = integer + '.' + decimal;
        } else if (integer.length) {
            result = integer;
        } else if (decimal.length) {
            result = decimal;
        }

        return Number(result);
    }

    private getSeparator(separatorType: 'decimal' | 'group'): string | undefined {
        const numberWithGroupAndDecimalSeparator = 1000.1;

        return Intl.NumberFormat(this.locale)
            .formatToParts(numberWithGroupAndDecimalSeparator)
            .find(part => part.type === separatorType)
            ?.value;
    }
}

export default LocaleNumber;