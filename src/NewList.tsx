import { useState } from 'react';

type Props = {
  onCreateList: (name: string) => void;
};

export default function NewListButton({ onCreateList }: Props) {
  const [name, setName] = useState<string>('');

  const handleClick = () => {
    if (!name.trim()) return;
    onCreateList(name);
    setName('');
  };
  return (
    <>
      <form onSubmit={handleClick}>
        <input
          type="text"
          placeholder="Enter List Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <button className="new-list-button" onClick={handleClick}>
          + New Grocery List
        </button>
      </form>
    </>
  );
}
