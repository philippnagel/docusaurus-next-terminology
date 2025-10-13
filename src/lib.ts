import path from 'path';
import fs from 'node:fs/promises';
import parseMD from 'parse-md';
import { glob } from 'tinyglobby';
import type { IOptions, ITerm } from './types.js';

const glossaryHeader = `---
id: glossary
title: Glossary
---`;

interface IFrontmatterGlossary {
  id: string;
  title: string;
  hoverText: string;
  glossaryText: string;
  type: string;
  displayType?: "tooltip" | "popover";
}

interface IParsedMd {
  metadata: IFrontmatterGlossary;
  content: string;
}

function arrayDiff<T>(arr: T[], exclude: T[]): T[] {
  return arr.filter(item => !exclude.includes(item));
}

export async function getFiles(
  basePath: string,
  noParseFiles: string[],
  noThrow = false
): Promise<string[]> {
  // fixes paths on Windows environments, glob requires forward slashes
  const fixedPath = basePath.replaceAll('\\', '/');

  let files: string[] = [];
  try {
    files = await glob(fixedPath + '**/*.{md,mdx}');
  } catch (err) {
    if (noThrow) {
    } else {
      throw err;
    }
  }

  const normalizedExclude = noParseFiles.map(f =>
    path.normalize(f).replaceAll('\\', '/')
  );
  const normalizedFiles = files.map(f =>
    path.normalize(f).replaceAll('\\', '/')
  );

  return arrayDiff(normalizedFiles, normalizedExclude);
}

export async function preloadTerms(termsFiles: any[]) {
  const terms = [];
  for (const term of termsFiles) {
    let fileContent = '';
    try {
      fileContent = await fs.readFile(term, 'utf8');
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log(`File ${term} not found.`);
      } else {
        console.log(`${err}\nExiting...`);
      }
      process.exit(1);
    }
    const { metadata } = parseMD(fileContent) as IParsedMd;
    if (!metadata.id) {
      console.log(
        `! The term "${term}" lacks the attribute "id" and so is ` +
        `excluded from the term parsing functionality.`
      );
    } else {
      if (!metadata.hoverText || metadata.hoverText.length == 0) {
        console.log(
          `! The term "${term}" lacks the attribute "hoverText", ` +
          `so no popup text will be shown.`
        );
      }
      const data = {
        content: fileContent,
        filepath: term,
        hoverText: metadata.hoverText || '',
        glossaryText: metadata.glossaryText || '',
        type: metadata.type || '',
        displayType: metadata.displayType || '',
        id: metadata.id,
        title: metadata.title || ''
      };
      terms.push(data);
    }
  }
  return terms;
}

export function getCleanTokens(match: string, separator: string): string[] {
  const tokens = match.split(separator);

  if (tokens[1]) {
    tokens[1] = tokens[1].replace(/\.[^/.]+$/, '');
  }

  tokens.forEach((token: string, index: number) => {
    tokens[index] = token.replace(/[%]/g, '');
  });

  return tokens;
}

export function getHeaders(content: string): string {
  const index = content.indexOf('---', 1) + '---'.length;
  // slice the headers of the file
  return content.slice(0, index);
}

export function addJSImportStatement(content: string) {
  const importStatement =
    `\n\nimport Term ` +
    `from "@philippnagel/docusaurus-next-terminology/components/tooltip.js";\n`;
  return importStatement + content;
}

export function sortFiles(files: any[]) {
  files.sort(
    (
      a: { title: { toLowerCase: () => number } },
      b: { title: { toLowerCase: () => number } }
    ) =>
      a.title.toLowerCase() > b.title.toLowerCase()
        ? 1
        : b.title.toLowerCase() > a.title.toLowerCase()
          ? -1
          : 0
  );
}

export function cleanGlossaryTerms(terms: any[]) {
  const cleanTerms = terms.filter(
    (item: { title: string | any[]; filepath: any }) => {
      return item.title && item.title.length > 0
        ? true
        : console.log(
          `! The file ${item.filepath} lacks the attribute "title" and so is ` +
          `excluded from the glossary.`
        );
    }
  );
  // handle debug case here
  return cleanTerms;
}

export function filterTypeTerms(
  terms: any[],
  glossaryTermPatterns: string | any[]
) {
  if (glossaryTermPatterns.length == 0) {
    console.log(
      '! No glossaryTermPatterns were specified to filter ' + 'terms by type.'
    );
    return terms;
  }
  const typeTerms = terms.filter((item: { type: any; id: any }) => {
    return glossaryTermPatterns.indexOf(item.type) > -1
      ? true
      : console.log(
        `! The attribute "type" of term "${item.id}" is missing or does not ` +
        `match any type listed in the glossaryTermPatterns.`
      );
  });
  return typeTerms;
}

export function getGlossaryTerm(term: ITerm, path: string) {
  let hover = term.glossaryText != undefined ? term.glossaryText : '';
  if (hover.length <= 0) {
    hover = term.hoverText != undefined ? term.hoverText : '';
  }
  return hover.length > 0
    ? `\n\n### [${term.title}](${path}) \n${hover}\n`
    : `\n\n### [${term.title}](${path})`;
}

export async function getOrCreateGlossaryFile(path: string) {
  let fileContent = '';

  try {
    await fs.access(path);

    const content = await fs.readFile(path, { encoding: 'utf8' });
    const index = content.indexOf('---', 1) + '---'.length;
    fileContent = content.slice(0, index);
  } catch (err) {
    console.log(
      `! Glossary file does not exist in path: "${path}". Creating...`
    );
    fileContent = glossaryHeader;

    try {
      await fs.writeFile(path, fileContent, 'utf8');
    } catch (writeErr) {
      console.log(writeErr);
      throw writeErr;
    }
  }

  return fileContent;
}

export function getRelativePath(_: string, target: string, opts: IOptions) {
  const targetDir = target.substring(0, target.lastIndexOf('/'));
  const relative_url = path.relative(opts.termsDir, targetDir);
  const final_url = path.join(
    opts.termsUrl,
    relative_url,
    target.substring(target.lastIndexOf('/'))
  );

  return final_url.replace(/(\.mdx?)/g, '');
}