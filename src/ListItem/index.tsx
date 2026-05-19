import './index.scss';

type Props = {
  value: string;
  completed: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  onSaveEdit?: () => void;
  onToggle?: () => void;
};

export default function ListItem({
  value,
  completed,
  onRemove,
  onEdit,
  onSaveEdit,
  onToggle,
}: Props) {
  return (
    <li
      className={`item ${completed ? 'completed' : ''}`}
      onClick={onEdit}
      style={{ cursor: 'pointer' }}
      onBlur={onSaveEdit}
    >
      <span className="item-name">{value}</span>
      <input
        type="checkbox"
        checked={completed}
        onClick={(e) => e.stopPropagation()}
        onChange={onToggle}
      />
      {onEdit && (
        <button
          className="edit-list-item"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          Edit Item
        </button>
      )}

      {onRemove && (
        <button
          className="remove-list-item"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          Remove
        </button>
      )}
    </li>
  );
}
