import { useState } from 'react';

type CompletedListCardProps = {
  completedList: CompletedList;
  onCreateListFromHistory: (listName: string, itemValues: string[]) => void;
};
type CompletedList = {
  id: string;
  originalListId: string;
  name: string;
  completedAt: string;
  items: CompletedListItem[];
};
type CompletedListItem = {
  id: string;
  value: string;
};

export default function CompletedListCard({
  completedList,
  onCreateListFromHistory,
}: CompletedListCardProps) {
  const [name, setName] = useState<string>('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(
    completedList.items.map((item) => item.id)
  );
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
      <h2>{completedList.name}</h2>

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
