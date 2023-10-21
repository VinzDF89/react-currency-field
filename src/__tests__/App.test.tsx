import '@testing-library/jest-dom'
import { render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

function setup() {
    render(<App />);

    return {
        user: userEvent.setup(),
        inputField: screen.getByRole('textbox') as HTMLInputElement
    }
}

describe('Testing CurrencyField controlled by App', () => {
    // 1. Initialization check
    // Initialize the component with a default value of 5000 and locale set to en-US, check the formatted value to be equal to 5,000
    test('Initialization check: should match 5,000', () => {
        const { inputField } = setup();

        expect(inputField).toHaveValue('5,000');
    })

    // 2. Decimal part check
    // Move to the end of the field and add a decimal part of .12, check the formatted value to be equal to 5,000.12
    test('Decimal part check: should change the value and match 5,000.12', async () => {
        const { user, inputField } = setup();

        await user.click(inputField);
        await user.keyboard('.12');

        expect(inputField).toHaveValue('5,000.12');
    })

    // 3. Thousand separator check
    // Clear the input and type 1234000.12, check the formatted value to be equal to 1,234,000.12
    test('Thousand separator check: should change the value and match 1,234,000.12', async () => {
        const { user, inputField } = setup();

        await user.clear(inputField);
        await user.keyboard('1234000.12');

        expect(inputField).toHaveValue('1,234,000.12');
    })

    // 4. Deletion check
    // Clear the input, type 1234000.12, move after number 4
    // Delete one by one the numbers at the left and check every time the formatted number
    test('Deletion check: should verify the value after each number deletion', async () => {
        const { user, inputField } = setup();

        await user.clear(inputField);
        await user.keyboard('1234000.12');
        
        inputField.setSelectionRange(5, 5);

        await user.keyboard('[Backspace]');
        expect(inputField).toHaveValue('123,000.12');

        await user.keyboard('[Backspace]');
        expect(inputField).toHaveValue('12,000.12');

        await user.keyboard('[Backspace]');
        expect(inputField).toHaveValue('1,000.12');

        await user.keyboard('[Backspace]');
        expect(inputField).toHaveValue(',000.12');
    })

    // 5. Max value exceeded check
    test('Max value exceeded check', async () => {
        const { user, inputField } = setup();

        await user.click(inputField);
        inputField.setSelectionRange(0, 0);

        await user.keyboard('999');
        const maxFlag = screen.getByTestId('maxFlag');
        expect(maxFlag).toHaveTextContent('true');
    })

    // 6. Min value not reached check
    test('Min value not reached', async () => {
        const { user, inputField } = setup();

        await user.click(inputField);
        await user.keyboard('[Backspace]');
        const minFlag = screen.getByTestId('minFlag');
        expect(minFlag).toHaveTextContent('true');
    })
});