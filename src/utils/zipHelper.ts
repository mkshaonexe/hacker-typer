import JSZip from 'jszip';

export async function parseZipFile(file: File): Promise<Record<string, string>> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);
  const filesRecord: Record<string, string> = {};

  const filePromises: Promise<void>[] = [];

  loadedZip.forEach((relativePath, zipEntry) => {
    // Ignore directories; we only need files since paths represent the structure
    if (zipEntry.dir) return;

    const parts = relativePath.split('/');
    
    // Filter out common build directories, hidden files, dependencies, and binaries
    const shouldIgnore = 
      parts.includes('node_modules') ||
      parts.includes('.git') ||
      parts.includes('.next') ||
      parts.includes('dist') ||
      parts.includes('build') ||
      parts.includes('out') ||
      parts.some(part => part.startsWith('.')) || // matches hidden files/folders (e.g. .DS_Store, .vscode)
      /\.(png|jpe?g|gif|svg|webp|ico|mp3|wav|mp4|mov|zip|gz|tar|pdf|docx?|xlsx?|pptx?|exe|dll|so|dylib|bin|woff2?|ttf|otf|eot)$/i.test(relativePath);

    if (shouldIgnore) return;

    // Read the file as a string
    const promise = zipEntry.async('string').then((content) => {
      // Only keep files that are not completely empty or binary
      filesRecord[relativePath] = content;
    });

    filePromises.push(promise);
  });

  await Promise.all(filePromises);

  if (Object.keys(filesRecord).length === 0) {
    throw new Error('No valid text files found in the ZIP. Please ensure the project contains source files (HTML, CSS, JS, TS, etc.).');
  }

  return filesRecord;
}
