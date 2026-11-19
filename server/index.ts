// ===========================================================
//  LE BACK : un petit serveur Express
//  Il garde la liste des tâches dans MongoDB et répond aux demandes du front.
// ===========================================================
import express from 'express';
import { MongoClient } from 'mongodb';

type Tache = { id: number; titre: string; terminee: boolean };

// Connexion à la base locale (on peut changer l'adresse avec la variable MONGO_URL)
const client = new MongoClient(process.env.MONGO_URL ?? 'mongodb://localhost:27017');
await client.connect();
const taches = client.db('duoday-todo').collection<Tache>('taches');
const sansIdMongo = { projection: { _id: 0 } }; // le front n'a besoin que de notre "id"

// Au premier lancement, la base est vide : on y met quelques tâches d'exemple
if ((await taches.countDocuments()) === 0) {
  await taches.insertMany([
    { id: 1, titre: 'Prendre un café avec l’équipe', terminee: true },
    { id: 2, titre: 'Dessiner l’architecture de l’appli', terminee: true },
    { id: 3, titre: 'Faire mon premier commit', terminee: false },
    { id: 4, titre: 'Corriger un bug', terminee: false },
    { id: 5, titre: 'Ajouter une fonctionnalité', terminee: false },
  ]);
}

const app = express();
app.use(express.json()); // pour lire le JSON envoyé par le front

// Récupérer toutes les tâches
app.get('/api/todos', async (req, res) => {
  res.json(await taches.find({}, sansIdMongo).sort({ id: 1 }).toArray());
});

// Ajouter une tâche
app.post('/api/todos', async (req, res) => {
  const titre = req.body.title;

  if (!titre || titre.trim() === '') {
    return res.status(400).json({ erreur: 'Le titre de la tâche est obligatoire.' });
  }

  // shortcut: deux ajouts simultanés peuvent obtenir le même id, passer à un compteur atomique si l'appli a plusieurs utilisateurs
  const derniere = await taches.findOne({}, { sort: { id: -1 } });
  const nouvelleTache: Tache = { id: (derniere?.id ?? 0) + 1, titre: titre.trim(), terminee: false };
  await taches.insertOne({ ...nouvelleTache }); // copie : insertOne ajoute un _id à l'objet
  res.status(201).json(nouvelleTache);
});

// Cocher / décocher une tâche
app.patch('/api/todos/:id', async (req, res) => {
  const id = Number(req.params.id);
  const tache = await taches.findOneAndUpdate(
    { id },
    [{ $set: { terminee: { $not: '$terminee' } } }],
    { ...sansIdMongo, returnDocument: 'after' },
  );

  if (!tache) {
    return res.status(404).json({ erreur: 'Cette tâche n’existe pas.' });
  }

  res.json(tache);
});

// Supprimer une tâche
app.delete('/api/todos/:id', async (req, res) => {
  const id = Number(req.params.id);
  await taches.deleteOne({ id });
  res.status(204).end();
});

app.listen(3001, () => {
  console.log('Le back tourne sur http://localhost:3001');
});
