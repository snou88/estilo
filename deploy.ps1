# Supprimer le dossier temporaire s'il existe
Remove-Item -Path "temp" -Recurse -Force -ErrorAction SilentlyContinue

# Créer le dossier assets s'il n'existe pas
New-Item -Path "assets" -ItemType Directory -Force

# Construire l'application
npm run build

# Copier les fichiers nécessaires
Copy-Item -Path "temp\index.html" -Destination "." -Force
Copy-Item -Path "temp\assets\*" -Destination "assets" -Force -Recurse

# Supprimer le dossier temporaire
Remove-Item -Path "temp" -Recurse -Force

# Supprimer le fichier temporaire
Remove-Item -Path "index.html.tmp" -Force -ErrorAction SilentlyContinue
