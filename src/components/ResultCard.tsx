import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface ResultCardProps {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  matchDate: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  showActions?: boolean;
}

const ResultCard = ({
  id,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  matchDate,
  onEdit,
  onDelete,
  showActions = true,
}: ResultCardProps) => {
  return (
    <div className="result-card animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <span className="team-name min-w-[60px]">{homeTeam}</span>
          <div className="flex items-center gap-2">
            <span className="score-badge bg-secondary text-foreground">{homeScore}</span>
            <span className="text-muted-foreground font-medium">:</span>
            <span className="score-badge bg-secondary text-foreground">{awayScore}</span>
          </div>
          <span className="team-name min-w-[60px]">{awayTeam}</span>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={() => onEdit(id)}
              className="icon-button-edit"
              aria-label="Edit match"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="icon-button-delete"
              aria-label="Delete match"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-2 text-right">
        <span className="text-xs text-muted-foreground">
          {format(new Date(matchDate), "EEE, dd.MM.yyyy")}
        </span>
      </div>
    </div>
  );
};

export default ResultCard;
