# Créer le dossier temporaire
New-Item -Path "temp" -ItemType Directory -Force

# Créer le dossier assets s'il n'existe pas
New-Item -Path "assets" -ItemType Directory -Force

# Copier le fichier index.html temporaire
Copy-Item -Path "index.html.tmp" -Destination "temp/index.html" -Force

# Construire l'application avec la configuration de développement
npx vite build --config vite.config.dev.ts

# Copier les fichiers générés
Copy-Item -Path "temp\assets\*" -Destination "assets" -Force -Recurse

# Nettoyer
Remove-Item -Path "temp" -Recurse -Force
Remove-Item -Path "index.html.tmp" -Force -ErrorAction SilentlyContinue
