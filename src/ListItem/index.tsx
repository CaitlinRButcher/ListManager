import './index.scss';

type Props = {
  value: string;
  onRemove?: () => void;
  onEdit?: () => void;
  onSaveEdit?: () => void;
};

export default function ListItem({
  value,
  onRemove,
  onEdit,
  onSaveEdit,
}: Props) {
  return (
    <li
      className="item"
      onClick={onEdit}
      style={{ cursor: 'pointer' }}
      onBlur={onSaveEdit}
    >
      <span className="item-name">{value}</span>
      {onRemove && (
        <>
          <button className="edit-list-item" onClick={() => onEdit}>
            Edit Item
          </button>
          <button
            className="remove-list-item"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            Remove
          </button>
        </>
      )}
    </li>
  );
}
