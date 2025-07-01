# Créer le dossier assets s'il n'existe pas
New-Item -Path "assets" -ItemType Directory -Force

# Construire l'application avec la configuration simple
npx vite build --config vite.config.simple.ts

# Nettoyer les fichiers temporaires
Remove-Item -Path "index.html.tmp" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "temp" -Recurse -Force -ErrorAction SilentlyContinue
