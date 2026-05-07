import { useState, useEffect, useRef } from 'react';
import NewListItem from '../NewListItem';
import './index.scss';
import ListItem from '../ListItem/index';

type Props = {
  listId: string;
  listName: string;
  onReturn: () => void;
};

type ListItem = {
  id: string;
  value: string;
};

export default function FocusedList({ listId, listName, onReturn }: Props) {
  const storageKey = `items-${listId}`;
  const [items, setItems] = useState<ListItem[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [editingIndex, setEditingIndex] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreate = (name: string): void => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        value: name,
      },
    ]);
  };
  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveEdit = (id: string, newValue: string) => {
    if (editingIndex == null) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: newValue } : item))
    );
    setEditingIndex(null);
    setEditingItem('');
  };

  const handleEdit = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setEditingIndex(id);
    setEditingItem(item.value);
  };

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  useEffect(() => {
    if (editingIndex !== null) {
      inputRef.current?.focus();
    }
  }, [editingIndex]);

  return (
    <>
      <div className="list-header">
        <button onClick={onReturn}>Go Back</button>
        <h4>{listName}</h4>
      </div>
      <div>
        <NewListItem onCreate={handleCreate} />
      </div>
      <ul>
        {items.map((item) =>
          editingIndex === item.id ? (
            <li key={item.id} className="list-item">
              <input
                ref={inputRef}
                value={editingItem}
                onChange={(e) => setEditingItem(e.target.value)}
                onBlur={() => handleSaveEdit(item.id, editingItem)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveEdit(item.id, editingItem);
                  }

                  if (e.key === 'Escape') {
                    setEditingIndex(null);
                    setEditingItem('');
                  }
                }}
              />
            </li>
          ) : (
            <ListItem
              key={item.id}
              value={item.value}
              onRemove={() => handleRemove(item.id)}
              onEdit={() => handleEdit(item.id)}
            />
          )
        )}
      </ul>
    </>
  );
}
