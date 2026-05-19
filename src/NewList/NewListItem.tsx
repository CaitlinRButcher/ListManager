import { useState } from 'react';

type Props = {
  onCreate: (name: string) => void;
};

export default function NewListItem({ onCreate }: Props) {
  const [name, setName] = useState<string>('');

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) return;

    onCreate(trimmedName);
    setName('');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <button className="new-list-item-button" type="submit">
          Add
        </button>
      </form>
    </>
  );
}
