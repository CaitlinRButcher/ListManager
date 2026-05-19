import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewListButton from './NewList';

describe('NewListButton', () => {
  it('creates a list with the typed name', async () => {
    const user = userEvent.setup();
    const onCreateList = vi.fn();

    render(<NewListButton onCreateList={onCreateList} />);

    const input = screen.getByRole('textbox', { name: /list name/i });
    const button = screen.getByRole('button', { name: /create/i });

    await user.type(input, 'Groceries');
    await user.click(button);

    expect(onCreateList).toHaveBeenCalledTimes(1);
    expect(onCreateList).toHaveBeenCalledWith('Groceries');
  });
});
