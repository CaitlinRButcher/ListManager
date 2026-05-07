import './App.css';
import { useState, useEffect } from 'react';
import NewListButton from './NewList';
import FocusedList from './FocusedList/index.tsx';

type Props = {
  id: string;
};

type Lists = {
  id: string;
  value: string;
};

export default function App({ id }: Props) {
  const listStorageKey = `list-${id}`;
  const [lists, setLists] = useState<Lists[]>(() => {
    const saved = localStorage.getItem(listStorageKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [openListId, setOpenListId] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState('');
  const openList = lists.find((e) => e.id === openListId);

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

  useEffect(() => {
    localStorage.setItem(listStorageKey, JSON.stringify(lists));
  }, [listStorageKey, lists]);
  return (
    <>
      {openListId === null ? (
        <div className="new-list-container">
          <NewListButton onCreateList={handleCreateList} />
          {lists.length > 0 && (
            <ul className="list-menu">
              {lists.map((list) => (
                <li className="lists-container" key={list.id}>
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

                  <button
                    className="edit-list"
                    onClick={() => handleEdit(list.id)}
                  >
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
      ) : openList ? (
        <FocusedList
          listId={openList.id}
          listName={openList.value}
          onReturn={handleReturn}
        />
      ) : (
        <button onClick={handleReturn}>Go Back</button>
      )}
    </>
  );
}
