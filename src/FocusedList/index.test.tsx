import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FocusedList from './index';

const renderFocusedList = (
  props?: Partial<React.ComponentProps<typeof FocusedList>>
) => {
  const defaultProps = {
    listId: 'list-1',
    listName: 'Groceries',
    onReturn: vi.fn(),
  };

  return {
    ...render(<FocusedList {...defaultProps} {...props} />),
    props: {
      ...defaultProps,
      ...props,
    },
  };
};

const getStoredItems = (listId = 'list-1') => {
  const storedItems = localStorage.getItem(`items-${listId}`);
  return storedItems ? JSON.parse(storedItems) : null;
};

describe('FocusedList', () => {
  beforeEach(() => {
    localStorage.clear();

    Object.defineProperty(globalThis, 'crypto', {
      value: {
        ...globalThis.crypto,
        randomUUID: vi.fn(() => 'mock-item-id'),
      },
      writable: true,
    });
  });

  it('renders the list name', () => {
    renderFocusedList();

    expect(
      screen.getByRole('heading', { name: /groceries/i })
    ).toBeInTheDocument();
  });

  it('calls onReturn when Go Back is clicked', async () => {
    const user = userEvent.setup();
    const onReturn = vi.fn();

    renderFocusedList({ onReturn });

    const goBackButton = screen.getByRole('button', { name: /go back/i });

    await user.click(goBackButton);

    expect(onReturn).toHaveBeenCalledTimes(1);
  });

  it('loads existing items from localStorage', () => {
    localStorage.setItem(
      'items-list-1',
      JSON.stringify([
        {
          id: 'item-1',
          value: 'Milk',
        },
      ])
    );

    renderFocusedList();

    expect(screen.getByText('Milk')).toBeInTheDocument();
  });

  it('creates a new item', async () => {
    const user = userEvent.setup();

    renderFocusedList();

    const input = screen.getByRole('textbox');
    const createButton = screen.getByRole('button', { name: /create|add/i });

    await user.type(input, 'Eggs');
    await user.click(createButton);

    expect(screen.getByText('Eggs')).toBeInTheDocument();

    await waitFor(() => {
      expect(getStoredItems()).toEqual([
        {
          id: 'mock-item-id',
          value: 'Eggs',
        },
      ]);
    });
  });

  it('removes an item', async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      'items-list-1',
      JSON.stringify([
        {
          id: 'item-1',
          value: 'Milk',
        },
      ])
    );

    renderFocusedList();

    const removeButton = screen.getByRole('button', { name: /remove/i });

    await user.click(removeButton);

    expect(screen.queryByText('Milk')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(getStoredItems()).toEqual([]);
    });
  });

  it('enters edit mode when an item is clicked', async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      'items-list-1',
      JSON.stringify([
        {
          id: 'item-1',
          value: 'Milk',
        },
      ])
    );

    renderFocusedList();

    await user.click(screen.getByText('Milk'));

    expect(screen.getByDisplayValue('Milk')).toBeInTheDocument();
  });

  it('saves an edited item when Enter is pressed', async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      'items-list-1',
      JSON.stringify([
        {
          id: 'item-1',
          value: 'Milk',
        },
      ])
    );

    renderFocusedList();

    await user.click(screen.getByText('Milk'));

    const editInput = screen.getByDisplayValue('Milk');

    await user.clear(editInput);
    await user.type(editInput, 'Oat Milk{Enter}');

    expect(screen.getByText('Oat Milk')).toBeInTheDocument();
    expect(screen.queryByText('Milk')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(getStoredItems()).toEqual([
        {
          id: 'item-1',
          value: 'Oat Milk',
        },
      ]);
    });
  });

  it('saves an edited item when the input loses focus', async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      'items-list-1',
      JSON.stringify([
        {
          id: 'item-1',
          value: 'Milk',
        },
      ])
    );

    renderFocusedList();

    await user.click(screen.getByText('Milk'));

    const editInput = screen.getByDisplayValue('Milk');

    await user.clear(editInput);
    await user.type(editInput, 'Almond Milk');

    fireEvent.blur(editInput);

    expect(screen.getByText('Almond Milk')).toBeInTheDocument();

    await waitFor(() => {
      expect(getStoredItems()).toEqual([
        {
          id: 'item-1',
          value: 'Almond Milk',
        },
      ]);
    });
  });

  it('cancels editing when Escape is pressed', async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      'items-list-1',
      JSON.stringify([
        {
          id: 'item-1',
          value: 'Milk',
        },
      ])
    );

    renderFocusedList();

    await user.click(screen.getByText('Milk'));

    const editInput = screen.getByDisplayValue('Milk');

    await user.clear(editInput);
    await user.type(editInput, 'Oat Milk{Escape}');

    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.queryByText('Oat Milk')).not.toBeInTheDocument();

    expect(getStoredItems()).toEqual([
      {
        id: 'item-1',
        value: 'Milk',
      },
    ]);
  });

  it('uses listId, not listName, for the localStorage key', () => {
    localStorage.setItem(
      'items-list-1',
      JSON.stringify([
        {
          id: 'item-1',
          value: 'Milk',
        },
      ])
    );

    localStorage.setItem(
      'items-Groceries',
      JSON.stringify([
        {
          id: 'wrong-item',
          value: 'This should not render',
        },
      ])
    );

    renderFocusedList({
      listId: 'list-1',
      listName: 'Groceries',
    });

    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(
      screen.queryByText('This should not render')
    ).not.toBeInTheDocument();
  });
});
