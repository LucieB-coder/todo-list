import type { Tache } from './api';

type Props = {
  tache: Tache;
  estChoisie: boolean;
  onBasculer: (id: number) => void;
  onSupprimer: (id: number) => void;
};

// Une ligne de la liste : une case à cocher, le titre, et un bouton pour supprimer
export default function TodoItem({ tache, estChoisie, onBasculer, onSupprimer }: Props) {
  const classes = ['tache'];
  if (tache.terminee) classes.push('terminee');
  if (estChoisie) classes.push('choisie');

  return (
    <li className={classes.join(' ')}>
      <label>
        <input
          type="checkbox"
          checked={tache.terminee}
          onChange={() => onBasculer(tache.id)}
        />
        <span className="titre">{tache.titre}</span>
      </label>
      <button
        className="supprimer"
        onClick={() => onSupprimer(tache.id)}
        aria-label={`Supprimer « ${tache.titre} »`}
      >
        ×
      </button>
    </li>
  );
}
