import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

interface User {
  userId: number;
  name: string;
}

export interface Anecdote {
  anecdoteId: number;
  version: number;
  title: string;
  text: string;
  author: User;
  createdAt: Date;
}

export class AnecdotesService {
  anecdotesDir: string;

  constructor(dataDir: string) {
    this.anecdotesDir = dataDir;
  }

  async readAll(): Promise<Anecdote[]> {
    const results: Anecdote[] = [];
    try {
      const fileNames = await readdir(this.anecdotesDir);
      for (const fileName of fileNames) {
        const filePath = join(this.anecdotesDir, fileName);
        const fileContents = await readFile(filePath, { encoding: 'utf-8' });
        results.push(JSON.parse(fileContents));
      }
    } catch (err) {
      console.error(err);
    }
    return results;
  }
}
