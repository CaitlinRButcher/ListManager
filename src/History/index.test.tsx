import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CompletedListCard from './CompletedListCard';
import HistoryPage from './index';

const completedLists = [
  {
    id: 'completed-list-1',
    originalListId: 'list-1',
    name: 'Weekly Groceries',
    completedAt: '2026-01-15T12:00:00.000Z',
    items: [
      {
        id: 'item-1',
        value: 'Milk',
      },
      {
        id: 'item-2',
        value: 'Eggs',
      },
      {
        id: 'item-3',
        value: 'Bread',
      },
    ],
  },
];

const renderHistoryPage = (
  props?: Partial<React.ComponentProps<typeof HistoryPage>>
) => {
  const defaultProps = {
    completedLists,
    onReturn: vi.fn(),
    onCreateListFromHistory: vi.fn(),
  };

  return {
    ...render(<HistoryPage {...defaultProps} {...props} />),
    props: {
      ...defaultProps,
      ...props,
    },
  };
};

const renderCompletedListCard = (
  props?: Partial<React.ComponentProps<typeof CompletedListCard>>
) => {
  const defaultProps = {
    completedList: completedLists[0],
    onCreateListFromHistory: vi.fn(),
  };

  return {
    ...render(<CompletedListCard {...defaultProps} {...props} />),
    props: {
      ...defaultProps,
      ...props,
    },
  };
};

describe('HistoryPage', () => {
  it('renders a message when there are no completed lists', () => {
    renderHistoryPage({ completedLists: [] });

    expect(
      screen.getByRole('heading', { name: /completed lists/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/no completed lists yet/i)).toBeInTheDocument();
  });

  it('calls onReturn when Go Back is clicked', async () => {
    const user = userEvent.setup();
    const onReturn = vi.fn();

    renderHistoryPage({ onReturn });

    await user.click(screen.getByRole('button', { name: /go back/i }));

    expect(onReturn).toHaveBeenCalledTimes(1);
  });

  it('renders completed list cards', () => {
    renderHistoryPage();

    expect(
      screen.getByRole('heading', { name: /weekly groceries/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/milk/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/eggs/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bread/i)).toBeInTheDocument();
  });

  it('passes selected historical items to onCreateListFromHistory', async () => {
    const user = userEvent.setup();
    const onCreateListFromHistory = vi.fn();

    renderHistoryPage({ onCreateListFromHistory });

    await user.click(screen.getByRole('checkbox', { name: /eggs/i }));
    await user.type(screen.getByPlaceholderText(/item name/i), 'Restock');
    await user.click(
      screen.getByRole('button', {
        name: /create new list from these items/i,
      })
    );

    expect(onCreateListFromHistory).toHaveBeenCalledTimes(1);
    expect(onCreateListFromHistory).toHaveBeenCalledWith('Restock', [
      'Milk',
      'Bread',
    ]);
  });
});

describe('CompletedListCard', () => {
  it('renders the completed list details', () => {
    const expectedDate = new Date(
      completedLists[0].completedAt
    ).toLocaleDateString();

    renderCompletedListCard();

    expect(
      screen.getByRole('heading', { name: /weekly groceries/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Completed on ${expectedDate}`)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/milk/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/eggs/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bread/i)).toBeInTheDocument();
  });

  it('checks all completed items by default', () => {
    renderCompletedListCard();

    expect(screen.getByRole('checkbox', { name: /milk/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /eggs/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /bread/i })).toBeChecked();
  });

  it('toggles selected items before creating a new list', async () => {
    const user = userEvent.setup();
    const onCreateListFromHistory = vi.fn();

    renderCompletedListCard({ onCreateListFromHistory });

    await user.click(screen.getByRole('checkbox', { name: /milk/i }));
    await user.click(screen.getByRole('checkbox', { name: /bread/i }));
    await user.type(screen.getByPlaceholderText(/item name/i), 'Breakfast');
    await user.click(
      screen.getByRole('button', {
        name: /create new list from these items/i,
      })
    );

    expect(screen.getByRole('checkbox', { name: /milk/i })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: /eggs/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /bread/i })).not.toBeChecked();
    expect(onCreateListFromHistory).toHaveBeenCalledTimes(1);
    expect(onCreateListFromHistory).toHaveBeenCalledWith('Breakfast', [
      'Eggs',
    ]);
  });
});
