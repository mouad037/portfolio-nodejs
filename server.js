const express = require('express');
const path = require('path');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const fs = require('fs'); // Filesystem, pour charger nos fichiers de traduction

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration i18next
i18next
  .use(i18nextMiddleware.LanguageDetector) // Détecte la langue via le query param `?lng=en`
  .init({
    // Important: on doit charger les ressources manuellement car le backend par défaut n'est pas inclus
    resources: {
      en: {
        translation: JSON.parse(fs.readFileSync(path.join(__dirname, 'locales/en/translation.json'), 'utf-8'))
      },
      fr: {
        translation: JSON.parse(fs.readFileSync(path.join(__dirname, 'locales/fr/translation.json'), 'utf-8'))
      }
    },
    preload: ['fr', 'en'], // Langues à pré-charger
    fallbackLng: 'fr',     // Langue par défaut
  });

// Appliquer le middleware à notre app Express
app.use(i18nextMiddleware.handle(i18next));

// Configuration du moteur de template et des fichiers statiques
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Données des projets avec traductions
const myProjects = [
  {
    id: 'alpha',
    title: {
      fr: 'Tableau de Bord Analytique',
      en: 'Analytics Dashboard'
    },
    shortDescription: {
      fr: 'Un tableau de bord moderne pour la visualisation de données.',
      en: 'A modern dashboard for data visualization.'
    },
    imageUrls: [
        '/images/projet-dashboard-1.jpg',
        '/images/projet-dashboard-2.png'
    ],
    videoUrl: 'https://www.youtube.com/embed/votre_code_video_1',
    tags: ['React', 'Node.js', 'D3.js', 'WebSocket'],
    codeLink: 'https://github.com'
  },
  {
    id: 'beta',
    title: {
      fr: 'Site E-commerce "UrbanStyle"',
      en: '"UrbanStyle" E-commerce Site'
    },
    shortDescription: {
      fr: 'Une application de e-commerce complète avec gestion de panier.',
      en: 'A complete e-commerce application with cart management.'
    },
    imageUrls: [
        '/images/projet-ecommerce-1.jpg'
    ],
    videoUrl: 'https://www.youtube.com/embed/votre_code_video_2',
    tags: ['Node.js', 'Express', 'MongoDB', 'Stripe API'],
    codeLink: 'https://github.com'
  }
];

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.render('index', { t: req.t }); // La fonction t() est passée au template
});

// Route pour la page des projets
app.get('/projects', (req, res) => {
  const lang = req.language; // Récupère la langue active ('fr' ou 'en')

  // Traduit les données dynamiques des projets avant de les envoyer
  const translatedProjects = myProjects.map(p => {
    return {
      ...p, // Copie les champs non-traduits (id, imageUrls, etc.)
      title: p.title[lang] || p.title['fr'], // Utilise la langue active ou le français par défaut
      shortDescription: p.shortDescription[lang] || p.shortDescription['fr']
    }
  });

  res.render('projects', {
    projects: translatedProjects,
    t: req.t // La fonction t() est aussi passée ici
  });
});


// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré et à l'écoute sur http://localhost:${PORT}`);
});