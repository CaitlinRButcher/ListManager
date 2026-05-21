import { useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import type { CompletedList } from '../types';
import './index.scss';

type CompletedListCardProps = {
  completedList: CompletedList;
  onCreateListFromHistory: (listName: string, itemValues: string[]) => void;
  onDeleteCompletedList: (id: string) => void;
};

export default function CompletedListCard({
  completedList,
  onCreateListFromHistory,
  onDeleteCompletedList,
}: CompletedListCardProps) {
  const [name, setName] = useState<string>('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  function handleToggleSelectedItem(id: string) {
    setSelectedItemIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  }
  const selectedItemValues = completedList.items
    .filter((item) => selectedItemIds.includes(item.id))
    .map((item) => item.value);
  return (
    <section>
      <div className="completed-list-header">
        <h3>{completedList.name}</h3>
        <button
          className="delete-completed-list-button"
          onClick={() => onDeleteCompletedList(completedList.id)}
        >
          <FaRegTrashAlt />
        </button>
      </div>

      <p>
        Completed on {new Date(completedList.completedAt).toLocaleDateString()}
      </p>

      <ul>
        {completedList.items.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedItemIds.includes(item.id)}
                onChange={() => handleToggleSelectedItem(item.id)}
              />
              {item.value}
            </label>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <button
        onClick={() => onCreateListFromHistory(`${name}`, selectedItemValues)}
      >
        Create New List From These Items
      </button>
    </section>
  );
}
