import { readFile, writeFile } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Obter o caminho atual usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Caminho para o arquivo package.json
const packageJsonPath = resolve(__dirname, 'package.json');

// Função para incrementar a versão
const incrementVersion = (version) => {
  const versionParts = version.split('.');
  versionParts[2] = (parseInt(versionParts[2], 10) + 1).toString();
  return versionParts.join('.');
};

// Lê o package.json
readFile(packageJsonPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erro ao ler o package.json:', err);
    return;
  }

  const packageJson = JSON.parse(data);
  const currentVersion = packageJson.version;
  const newVersion = incrementVersion(currentVersion);

  packageJson.version = newVersion;

  // Escreve o novo package.json
  writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Erro ao escrever o package.json:', err);
      return;
    }
    console.log(`Versão atualizada de ${currentVersion} para ${newVersion}`);
  });
});
