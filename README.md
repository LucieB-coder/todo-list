# Mes tâches

Une petite application de liste de tâches, pour découvrir le développement web.

## Lancer l'application

Il faut avoir Node.js (version 22.18 ou plus, pour lancer le TypeScript directement) installé, et MongoDB lancé en local sur `localhost:27017` (ou une autre adresse dans la variable `MONGO_URL`).

```bash
npm install     # une seule fois, pour installer les outils
npm run dev     # lance le back et le front en même temps
```

Puis ouvrir http://localhost:5173 dans le navigateur.

## Comment c'est organisé

L'application est en deux parties, comme dans un restaurant :

- **Le front** (la salle) : ce que l'on voit à l'écran. Il est écrit avec React, dans le dossier `client/`.
  - `client/src/App.tsx` : l'écran principal
  - `client/src/TodoItem.tsx` : une ligne de la liste
  - `client/src/App.css` : les couleurs et la mise en page
- **Le back** (la cuisine) : il garde la liste des tâches. C'est un serveur Express, dans `server/index.ts`.
- **Le lien entre les deux** (le serveur qui fait les allers-retours) : `client/src/api.ts`. Chaque fonction envoie une demande au back, par exemple « donne-moi les tâches » ou « ajoute cette tâche ».

Quand on modifie un fichier et qu'on l'enregistre, l'application se met à jour toute seule.
