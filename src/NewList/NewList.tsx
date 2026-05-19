import { useState } from 'react';

type Props = {
  onCreateList: (name: string) => void;
};

export default function NewListButton({ onCreateList }: Props) {
  const [name, setName] = useState<string>('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreateList(name);
    setName('');
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="list-name">List Name</label>

        <input
          id="list-name"
          type="text"
          placeholder="Enter List Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit" className="new-list-button">
          Create
        </button>
      </form>
    </>
  );
}
