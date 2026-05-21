import './App.css';
import { useState, useEffect } from 'react';
import NewListButton from './NewList/NewList.tsx';
import FocusedList from './FocusedList/index.tsx';
import HistoryPage from './History/index.tsx';
import type { CompletedList, GroceryItem } from './types.ts';
type Props = {
  id: string;
};

export default function App({ id }: Props) {
  const listStorageKey = `list-${id}`;
  const completedListStorageKey = `completed-list-${id}`;
  const [lists, setLists] = useState<Lists[]>(() => {
    const saved = localStorage.getItem(listStorageKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [completedLists, setCompletedLists] = useState<CompletedList[]>(() => {
    const saved = localStorage.getItem(completedListStorageKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [openListId, setOpenListId] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState('');
  const openList = lists.find((e) => e.id === openListId);
  const [showHistory, setShowHistory] = useState(false);
  const handleCreateList = (name: string): void => {
    setLists((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        value: name,
      },
    ]);
  };
  const onOpenList = (id: string) => {
    setOpenListId(id);
  };
  const handleReturn = () => {
    setOpenListId(null);
    setShowHistory(false);
  };

  const handleRemove = (id: string) => {
    setLists((prev) => prev.filter((item) => item.id !== id));
    localStorage.removeItem(`items-${id}`);

    if (openListId === id) {
      setOpenListId(null);
    }

    if (editingIndex === id) {
      setEditingIndex(null);
      setEditingItem('');
    }
  };

  const handleSaveEdit = (id: string, newValue: string) => {
    if (editingIndex == null) return;
    setLists((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: newValue } : item))
    );
    setEditingIndex(null);
    setEditingItem('');
  };

  const handleEdit = (id: string) => {
    const item = lists.find((i) => i.id === id);
    if (!item) return;
    setEditingIndex(id);
    setEditingItem(item.value);
  };

  const handleCompleteList = (
    listId: string,
    listName: string,
    items: GroceryItem[]
  ) => {
    const completedList: CompletedList = {
      id: crypto.randomUUID(),
      originalListId: listId,
      name: listName,
      completedAt: new Date().toISOString(),
      items: items.map((item) => ({
        id: crypto.randomUUID(),
        value: item.value,
      })),
    };
    setCompletedLists((prev) => [completedList, ...prev]);
    setLists((prev) => prev.filter((list) => list.id !== listId));
    localStorage.removeItem(`items-${listId}`);
    setOpenListId(null);
  };

  const onDeleteCompletedList = (id: string) => {
    setCompletedLists((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCreateListFromHistory = (
    listName: string,
    itemValues: string[]
  ) => {
    const newList = {
      id: crypto.randomUUID(),
      value: listName,
    };

    const newItems: GroceryItem[] = itemValues.map((value) => ({
      id: crypto.randomUUID(),
      value: value,
      completed: false,
    }));

    setLists((prev) => [...prev, newList]);
    localStorage.setItem(`items-${newList.id}`, JSON.stringify(newItems));
    setShowHistory(false);
    setOpenListId(newList.id);
  };
  useEffect(() => {
    localStorage.setItem(listStorageKey, JSON.stringify(lists));
  }, [listStorageKey, lists]);

  useEffect(() => {
    localStorage.setItem(
      completedListStorageKey,
      JSON.stringify(completedLists)
    );
  }, [completedListStorageKey, completedLists]);
  if (openListId !== null && openList) {
    return (
      <FocusedList
        listId={openList.id}
        listName={openList.value}
        onReturn={handleReturn}
        onCompleteList={handleCompleteList}
      />
    );
  }
  if (openListId !== null && !openList) {
    return <button onClick={handleReturn}>Go Back</button>;
  }

  if (showHistory) {
    return (
      <HistoryPage
        completedLists={completedLists}
        onReturn={() => setShowHistory(false)}
        onCreateListFromHistory={handleCreateListFromHistory}
        onDeleteCompletedList={onDeleteCompletedList}
      />
    );
  }

  return (
    <div className="new-list-container">
      <div className="list-menu-actions">
        <NewListButton onCreateList={handleCreateList} />
        <button className="history-button" onClick={() => setShowHistory(true)}>
          View Completed Lists
        </button>
      </div>
      {lists.length > 0 && (
        <ul className="list-menu">
          {lists.map((list) => (
            <li className="list-container" key={list.id}>
              <div onClick={() => onOpenList(list.id)}>
                {editingIndex === list.id ? (
                  <input
                    value={editingItem}
                    onChange={(e) => setEditingItem(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onBlur={() => handleSaveEdit(list.id, editingItem)}
                    autoFocus
                  />
                ) : (
                  list.value
                )}
              </div>
              <button className="edit-list" onClick={() => handleEdit(list.id)}>
                Edit List Name
              </button>

              <button
                className="delete-list"
                onClick={() => handleRemove(list.id)}
              >
                Delete List
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
