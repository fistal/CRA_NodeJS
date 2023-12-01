const express = require('express'); 
const { initializeApp } = require('firebase/app');
const { getFirestore, addDoc, collection } = require('firebase/firestore');

const app = express();
const port = 3000;

// Chemin du fichier JSON téléchargé
const serviceAccount = require('./cranodejs-406800-f6bb8a8db8b5.json');

// Configuration Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBN-RCoOPoZx_ONIPhYg9ya-oqY1Pd811Q',
  authDomain: 'cranodejs.firebaseapp.com',
  projectId: 'cranodejs',
  storageBucket: 'cranodejs.appspot.com',
  messagingSenderId: '528675429664',
  appId: '1:528675429664:web:e187c31ddde2309cb08b45',
};

const firebaseApp = initializeApp(firebaseConfig, {useFetchStreams: false})
const db = getFirestore(firebaseApp, { keyFilename: serviceAccount });

// Middleware pour les requêtes JSON et URL encodées
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route principale
app.get('/', (req, res) => {
  res.send('<h1>Bienvenue sur votre application légère !</h1>');
});

// Route pour afficher le formulaire
app.get('/ajouter-intervention', (req, res) => {
  res.sendFile(__dirname + '/views/formulaire.html');
});

// Route pour traiter le formulaire
app.post('/ajouter-intervention', async (req, res) => {
  try {
    const { dateIntervention, mission, ressource, charge, statut, validationClient } = req.body;

    // Ajouter les données à Firestore
    const docRef = await addDoc(collection(db, 'interventions'), {
      dateIntervention,
      mission,
      ressource,
      charge,
      statut,
      validationClient,
    });

    console.log('Document ajouté avec ID :', docRef.id);

    // Redirigez l'utilisateur vers une page de confirmation
    res.redirect('/confirmation');
  } catch (err) {
    console.error('Erreur lors de l\'ajout des données à Firestore:', err);
    res.status(500).send('Erreur lors de l\'ajout des données à Firestore.');
  }
});

// Route pour la page de confirmation
app.get('/confirmation', (req, res) => {
  res.send('<h2>Données enregistrées avec succès !</h2>');
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
