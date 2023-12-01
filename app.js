const express = require("express");

const app = express();
const port = 3000;

const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");

const serviceAccount = require("./cranodejs-406800-f6bb8a8db8b5.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Middleware pour les requêtes JSON et URL encodées
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route principale
app.get("/", (req, res) => {
  res.send("<h1>Bienvenue sur votre application légère !</h1>");
});

// Route pour afficher le formulaire
app.get("/ajouter-intervention", (req, res) => {
  res.sendFile(__dirname + "/views/formulaire.html");
});

// Route pour traiter le formulaire
app.post("/ajouter-intervention", async (req, res) => {
  try {
    const {
      dateIntervention,
      mission,
      ressource,
      charge,
      statut,
      validationClient,
    } = req.body;

    const newIntervention = await db.collection("interventions").add({
      dateIntervention,
      mission,
      ressource,
      charge,
      statut,
      validationClient,
    });

    console.log("Added document with ID: ", newIntervention.id);

    // Redirigez l'utilisateur vers une page de confirmation
    res.redirect("/confirmation");
  } catch (err) {
    console.error("Erreur lors de l'ajout des données à Firestore:", err);
    res.status(500).send("Erreur lors de l'ajout des données à Firestore.");
  }
});

// Route pour la page de confirmation
app.get("/confirmation", (req, res) => {
  res.send("<h2>Données enregistrées avec succès !</h2>");
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
