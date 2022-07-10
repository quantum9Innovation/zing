#!/usr/bin/env bash
echo "Cloning repo..."
git clone https://github.com/quantum9Innovation/zing
cd zing
echo "Making config..."
mkdir config
cd config
echo "*" > .gitignore
echo "Put your speech here (see examples/ for inspiration)" > speech.txt
echo "/* Put any additional styling here */" > styling.css
cd ..
echo "Building site... (assumes you have \`npx\` installed)"
npx live-server
echo "If that didn't work, try creating a server from the zing/ directory or open zing/index.html manually"
echo "To re-run from the terminal, use: `npx live-server`"
