// ===========================================================
//  LE LIEN ENTRE LE FRONT ET LE BACK
//  Chaque fonction envoie une requête au serveur Express.
// ===========================================================

export type Tache = { id: number; titre: string; terminee: boolean };

export async function recupererTaches(): Promise<Tache[]> {
  const reponse = await fetch('/api/todos');
  return reponse.json();
}

export async function ajouterTache(titre: string): Promise<Tache> {
  const reponse = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titre: titre }),
  });
  const donnees = await reponse.json();
  if (!reponse.ok) {
    throw new Error(donnees.erreur);
  }
  return donnees;
}

export async function basculerTache(id: number): Promise<Tache> {
  const reponse = await fetch(`/api/todos/${id}`, { method: 'PATCH' });
  return reponse.json();
}

export async function supprimerTache(id: number): Promise<void> {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
}
