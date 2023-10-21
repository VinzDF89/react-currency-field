import LocaleNumber from "../utilities/LocaleNumber"

type FieldDataInfoProps = {
    amount: string | number,
    numericalAmount: number,
    maxLimit: number,
    minLimit: number,
    maxLimitExceeded: boolean,
    minLimitNotReached: boolean
}

function FieldDataInfo(props: FieldDataInfoProps) {
    const locale = new LocaleNumber('en-US');

    return (
        <div>
            <p>Current string value is: "<b id="stringValue">{props.amount}</b>"</p>
            <p>Current numerical value is: <b id="numericalValue">{props.numericalAmount}</b></p>
            <p>Max limit of {locale.getFormattedValue(props.maxLimit)} exceeded: <span className={`flag ${props.maxLimitExceeded ? 'success' : 'warning'}`} data-testid="maxFlag">{props.maxLimitExceeded ? 'true' : 'false'}</span></p>
            <p>Min limit of {locale.getFormattedValue(props.minLimit)} not reached: <span className={`flag ${props.minLimitNotReached ? 'success' : 'warning'}`} data-testid="minFlag">{props.minLimitNotReached ? 'true': 'false'}</span></p>
        </div>
    )
}

export default FieldDataInfo;