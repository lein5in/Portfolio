import os

# Liste stricte des dossiers et fichiers à ignorer
IGNORE_LIST = [
    '.env', '.git', '__pycache__', 'node_modules', '.env.example',
    'dump_code.py', 'code_complet.txt', 'README.md', 'readme.md',
    'data', 'venv', '.venv', 'env', 'dist', 'build',
    # Bibliothèques tierces vendorisées dans l'extension — code minifié,
    # aucune valeur de contexte, juste du volume en plus.
    'marked.min.js', 'highlight.min.js', 'jspdf.umd.min.js', 'purify.min.js', 'dumb_code.py', 'node_modules', 'package-lock.json', 'package.json', 'yarn.lock', 'pnpm-lock.yaml', 'eslint.config.js', 'tsconfig.json', 'vite.config.ts', 'tailwind.config.js', 'postcss.config.js', 'webpack.config.js', 'babel.config.js', 'jest.config.js', 'prettier.config.js', 'commitlint.config.js', 'stylelint.config.js', 'tsconfig.node.json', 'tsconfig.vite.json', 'tsconfig.eslint.json', 'tsconfig.jest.json', 'tsconfig.test.json', 'tsconfig.build.json', 'tsconfig.dev.json', 'tsconfig.prod.json', 'tsconfig.base.json', 'tsconfig.app.json', 'tsconfig.server.json', 'tsconfig.client.json', 'tsconfig.shared.json', 'tsconfig.types.json', 'tsconfig.paths.json', 'tsconfig.aliases.json', 'tsconfig.app.json']

# Extensions de fichiers pertinentes pour Seren : backend (Python),
# frontend (TS/TSX/CSS), extension Chrome (JS/HTML/CSS), config (JSON/YAML/SQL/INI)
VALID_EXTENSIONS = ['.py', '.ts', '.tsx', '.js', '.html', '.css', '.json', '.yaml', '.yml', '.sql', '.ini', '.txt']

print("Génération du fichier de contexte de code pour Claude...")

with open("code_complet.txt", "w", encoding="utf-8") as outfile:
    for root, dirs, files in os.walk("."):
        # Filtrer dynamiquement les dossiers ignorés pour éviter d'y entrer
        dirs[:] = [d for d in dirs if d not in IGNORE_LIST and not d.startswith('.')]
        
        for file in files:
            # Ignorer les fichiers spécifiques
            if file in IGNORE_LIST or file.endswith('.zip') or '.env' in file:
                continue
                
            if any(file.endswith(ext) for ext in VALID_EXTENSIONS):
                # Récupérer le chemin relatif complet propre (ex: agents/risk/risk_agent.py)
                filepath = os.path.relpath(os.path.join(root, file), ".")
                # Remplacer les antislashs Windows par des slashs standards
                filepath = filepath.replace("\\", "/")
                
                # Écrire l'en-tête au format exact demandé
                outfile.write(f"=== FILE: {filepath} ===\n")
                
                try:
                    with open(os.path.join(root, file), "r", encoding="utf-8") as infile:
                        outfile.write(infile.read())
                except Exception as e:
                    outfile.write(f"[Erreur de lecture du fichier : {e}]")
                
                # Ajouter un saut de ligne propre pour séparer du prochain en-tête
                outfile.write("\n\n")

print("Terminé avec succès ! Le fichier 'code_complet.txt' a été généré à la racine.")