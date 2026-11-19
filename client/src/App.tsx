// ===========================================================
//  LE FRONT : l'écran de l'application (React)
// ===========================================================
import { useEffect, useState, type FormEvent } from 'react';
import TodoItem from './TodoItem';
import { recupererTaches, ajouterTache, basculerTache, supprimerTache, type Tache } from './api';

type Filtre = 'toutes' | 'a-faire' | 'terminees';

export default function App() {
  const [taches, setTaches] = useState<Tache[]>([]);
  const [filtre, setFiltre] = useState<Filtre>('toutes');
  const [nouveauTitre, setNouveauTitre] = useState('');
  const [message, setMessage] = useState('');
  const [tacheChoisieId, setTacheChoisieId] = useState<number | null>(null);

  // Au démarrage, on demande la liste des tâches au back
  useEffect(() => {
    recupererTaches().then(setTaches);
  }, []);

  async function handleAjouter(evenement: FormEvent) {
    evenement.preventDefault();
    try {
      const tache = await ajouterTache(nouveauTitre);
      setTaches([...taches, tache]);
      setNouveauTitre('');
      setMessage('');
    } catch (erreur) {
      setMessage((erreur as Error).message);
    }
  }

  async function handleBasculer(id: number) {
    const tacheModifiee = await basculerTache(id);
    setTaches(taches.map((t) => (t.id === id ? tacheModifiee : t)));
  }

  async function handleSupprimer(id: number) {
    await supprimerTache(id);
    setTaches(taches.filter((t) => t.id !== id));
  }

  // Demande client : « Choisis pour moi »
  function choisirTacheAuHasard() {
    // À compléter !
    // Pour mettre une tâche en avant à l'écran : setTacheChoisieId(id de la tâche)
    // Pour afficher un petit message : setMessage('ton texte')
  }

  // On ne garde que les tâches qui correspondent au filtre sélectionné
  const tachesAffichees = taches.filter((tache) => {
    if (filtre === 'a-faire') return !tache.terminee;
    if (filtre === 'terminees') return tache.terminee;
    return true;
  });

  const nombreRestantes = taches.filter((t) => !t.terminee).length;

  return (
    <main className="app">
      <header>
        <h1>Mes tâches</h1>
        <p className="compteur">
          {nombreRestantes === 0
            ? 'Tout est fait !'
            : `${nombreRestantes} tâche${nombreRestantes > 1 ? 's' : ''} à faire`}
        </p>
      </header>

      <form className="ajout" onSubmit={handleAjouter}>
        <label htmlFor="nouvelle-tache" className="visuellement-cache">Nouvelle tâche</label>
        <input
          id="nouvelle-tache"
          value={nouveauTitre}
          onChange={(e) => setNouveauTitre(e.target.value)}
          placeholder="Ex. : lire la doc de React"
        />
        <button type="submit">Ajouter</button>
      </form>

      {message && <p className="message" role="status">{message}</p>}

      <div className="filtres" role="group" aria-label="Filtrer les tâches">
        <button className={filtre === 'toutes' ? 'actif' : ''} onClick={() => setFiltre('toutes')}>
          Toutes
        </button>
        <button className={filtre === 'a-faire' ? 'actif' : ''} onClick={() => setFiltre('a-faire')}>
          À faire
        </button>
        <button className={filtre === 'terminees' ? 'actif' : ''} onClick={() => setFiltre('terminees')}>
          Terminées
        </button>
      </div>

      <ul className="liste">
        {tachesAffichees.map((tache) => (
          <TodoItem
            key={tache.id}
            tache={tache}
            estChoisie={tache.id === tacheChoisieId}
            onBasculer={handleBasculer}
            onSupprimer={handleSupprimer}
          />
        ))}
      </ul>

      {tachesAffichees.length === 0 && <p className="vide">Aucune tâche ici.</p>}

      {/*
      <button className="hasard" onClick={choisirTacheAuHasard}>
        Choisis pour moi
      </button>
      */}
    </main>
  );
}
