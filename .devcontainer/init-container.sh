#!/bin/bash
set -e

echo "🔧 Initializing development container..."

# Create the SQLite database directory if it doesn't exist
mkdir -p "$(dirname "$SQLITE_PATH")"

# Set up .gitignore to ignore the SQLite database
if [ ! -f /workspace/.gitignore ]; then
  echo "Creating .gitignore file"
  echo -e "# SQLite database\n*.sqlite\n*.sqlite-journal\n\n# Logs\nlogs\n*.log\nnpm-debug.log*\n\n# Dependencies\nnode_modules/\n\n# Build outputs\ndist/\nbuild/\n\n# Environment variables\n.env.local\n.env.*.local\n\n# Editor directories and files\n.idea/\n.vscode/*\n!.vscode/extensions.json\n!.vscode/settings.json\n!.vscode/tasks.json\n!.vscode/launch.json\n*.suo\n*.ntvs*\n*.njsproj\n*.sln\n*.sw?\n\n# OS files\n.DS_Store\nThumbs.db" > /workspace/.gitignore
fi

echo "✅ Initialization complete!"