import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ListItem from './index';

describe('ListItem', () => {
  it('renders the item value', () => {
    render(
      <ul>
        <ListItem value="Milk" />
      </ul>
    );

    expect(screen.getByText('Milk')).toBeInTheDocument();
  });

  it('calls onEdit when the list item is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <ul>
        <ListItem value="Milk" onEdit={onEdit} />
      </ul>
    );

    const listItem = screen.getByRole('listitem');

    await user.click(listItem);

    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onRemove when the remove button is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(
      <ul>
        <ListItem value="Milk" onRemove={onRemove} />
      </ul>
    );

    const removeButton = screen.getByRole('button', { name: /remove/i });

    await user.click(removeButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('does not call onEdit when the remove button is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const onEdit = vi.fn();

    render(
      <ul>
        <ListItem value="Milk" onRemove={onRemove} onEdit={onEdit} />
      </ul>
    );

    const removeButton = screen.getByRole('button', { name: /remove/i });

    await user.click(removeButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onEdit).not.toHaveBeenCalled();
  });

  it('calls onSaveEdit when the list item loses focus', () => {
    const onSaveEdit = vi.fn();

    render(
      <ul>
        <ListItem value="Milk" onSaveEdit={onSaveEdit} />
      </ul>
    );

    const listItem = screen.getByRole('listitem');

    fireEvent.blur(listItem);

    expect(onSaveEdit).toHaveBeenCalledTimes(1);
  });
});
it('calls onEdit when the edit button is clicked', async () => {
  const user = userEvent.setup();
  const onEdit = vi.fn();

  render(
    <ul>
      <ListItem value="Milk" onEdit={onEdit} />
    </ul>
  );

  const editButton = screen.getByRole('button', { name: /edit item/i });

  await user.click(editButton);

  expect(onEdit).toHaveBeenCalledTimes(1);
});
