# --- Étape 1 : Le Point de Départ ---
# On choisit notre environnement de base. On prend une image officielle de Node.js
# La version 18 est stable. L'étiquette "-alpine" correspond à une version très légère
# de Linux, optimisée pour les conteneurs.
FROM node:18-alpine

# --- Étape 2 : Préparation de l'Espace de Travail ---
# On crée un dossier `/app` à l'intérieur du conteneur qui contiendra notre projet.
# Toutes les commandes suivantes seront exécutées depuis ce dossier.
WORKDIR /app

# --- Étape 3 : Installation des Dépendances (Optimisation) ---
# On copie d'abord UNIQUEMENT les fichiers qui listent nos dépendances.
# Pourquoi ? Docker met les étapes en cache. Si ces fichiers n'ont pas changé,
# Docker n'exécutera pas l'étape suivante (npm install), ce qui rend les builds
# futurs beaucoup plus rapides.
COPY package.json package-lock.json ./

# On exécute `npm install` pour télécharger toutes les librairies (Express, etc.).
RUN npm install

# --- Étape 4 : Copie du Code de l'Application ---
# Maintenant que les dépendances sont installées, on copie tout le reste de notre
# code (server.js, views, public, etc.) dans le dossier /app du conteneur.
COPY . .

# --- Étape 5 : Configuration du Réseau ---
# On indique à Docker que notre application, une fois lancée, écoutera sur le port 3000
# à l'intérieur du conteneur. C'est comme ouvrir une fenêtre dans notre "boîte".
EXPOSE 3000

# --- Étape 6 : La Commande de Démarrage ---
# C'est l'instruction finale. Quand le conteneur démarrera, il exécutera la commande
# `npm start` pour lancer notre serveur Node.js.
CMD [ "npm", "start" ]