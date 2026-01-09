import { Pencil, Trash2, User } from "lucide-react";

interface PlayerCardProps {
  id: string;
  name: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const PlayerCard = ({ id, name, onEdit, onDelete }: PlayerCardProps) => {
  return (
    <div className="result-card animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <span className="font-medium text-foreground">{name}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(id)}
            className="icon-button-edit"
            aria-label="Edit player"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="icon-button-delete"
            aria-label="Delete player"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
