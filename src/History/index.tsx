import { useState, useEffect, useRef } from 'react';
import CompletedListCard from './CompletedListCard';
import type { CompletedList } from '../types';
type Props = {
  completedLists: CompletedList[];
  onReturn: () => void;
  onCreateListFromHistory: (listName: string, itemValues: string[]) => void;
};

export default function HistoryPage({
  completedLists,
  onReturn,
  onCreateListFromHistory,
}: Props) {
  return (
    <div>
      <button onClick={onReturn}>Go Back</button>

      <h1>Completed Lists</h1>

      {completedLists.length === 0 ? (
        <p>No completed lists yet.</p>
      ) : (
        completedLists.map((completedList) => (
          <CompletedListCard
            key={completedList.id}
            completedList={completedList}
            onCreateListFromHistory={onCreateListFromHistory}
          />
        ))
      )}
    </div>
  );
}
