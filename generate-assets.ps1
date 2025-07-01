# Créer le dossier assets s'il n'existe pas
New-Item -Path "assets" -ItemType Directory -Force

# Créer un fichier index.js minimal
"console.log('React app is running!');" | Out-File -FilePath "assets/index.js" -Encoding UTF8

# Créer un fichier index.css minimal
"body { background-color: #fff; color: #000; }" | Out-File -FilePath "assets/index.css" -Encoding UTF8

# Créer un fichier App.js minimal
$AppContent = @"
import React from 'react';

function App() {
  return (
    <div>
      <h1>Estilo - Mode & Style</h1>
      <p>Bienvenue sur notre boutique en ligne !</p>
    </div>
  );
}

export default App;
"@
$AppContent | Out-File -FilePath "src/App.js" -Encoding UTF8

# Créer un fichier main.js minimal
$MainContent = @"
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"@
$MainContent | Out-File -FilePath "src/main.js" -Encoding UTF8
