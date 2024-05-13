// import { parse, ParserOptions } from '@babel/parser';
// import traverse, { NodePath } from '@babel/traverse';
// import prettier from 'prettier';
// import generate from '@babel/generator';
// import { TemplateLiteral, CommentBlock } from '@babel/types';
// import { highlight } from 'cli-highlight';
// const code = `

// const sample = /*tsx*/ \`<div>\${variable}</div>\`;
// const normalString = \`This should not change\`;

// `;

// // Parse the code into an AST
// const ast = parse(code, {
//   sourceType: 'module',
//   plugins: [
//     'typescript'
//   ],
// });

// // Function to format code using Prettier
// async function lint(code: string): Promise<string> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const formattedCode = prettier.format(code, { parser: 'babel-ts', semi: true});
//       resolve(formattedCode);
//     }, Math.random() * 1000);
//   });
// }

// // Define an interface for code edits
// interface CodeEdit {
//   start: number;
//   end: number;
//   code: string;
// }

// // Track edits to the code
// const edits: CodeEdit[] = [];

// // Traverse the AST to find template literals
// traverse(ast, {
//   TemplateLiteral(path: NodePath<TemplateLiteral>) {
//     // Check for leading comments marked as 'tsx'
//     const leadingComments = path.node.leadingComments as CommentBlock[];
//     if (leadingComments && leadingComments.some(comment => comment.value.includes('tsx'))) {
//       const { start, end } = path.node;
//       const rawTemplate = generate(path.node).code;
//       lint(rawTemplate).then(formattedCode => {
//         edits.push({ start: start!, end: end!, code: formattedCode });
//       });
//     }
//   }
// });

// // Applying edits once all promises resolve
// (async () => {
//   await Promise.all(edits.map(edit => lint(edit.code))); // Ensure all lint operations finish
//   let modifiedCode = code;
//   // Apply edits from last to first to avoid index errors
//   edits.sort((a, b) => b.start - a.start).forEach(edit => {
//     modifiedCode = modifiedCode.slice(0, edit.start) + edit.code + modifiedCode.slice(edit.end);
//   });
//   const highlightedCode = highlight(modifiedCode, { language: 'typescript', ignoreIllegals: true });
//   console.log(highlightedCode);
// })();


import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { TemplateLiteral } from '@babel/types';
import prettier from 'prettier';
import fs from 'fs';
import path from 'path';
import { highlight } from 'cli-highlight';

async function lint(code: string): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(prettier.format(code, { parser: 'babel-ts', semi: true, singleQuote: true }));
    }, Math.random() * 1000);
  });
}

async function processFile(filePath: string, lintingComment: string, outputPath: string): Promise<void> {
  const fullPath = path.join(__dirname, filePath);
  const originalCode = await fs.promises.readFile(fullPath, 'utf8');

  const ast = parse(originalCode, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx']
  });

  const nodesToProcess: TemplateLiteral[] = [];

  traverse(ast, {
    TemplateLiteral(path) {
      if (path.node.leadingComments?.some(comment => comment.value.trim() === lintingComment)) {
        nodesToProcess.push(path.node);
      }
    }
  });

  const edits = await Promise.all(nodesToProcess.map(async node => {
    const originalTemplate = generate(node).code;
    const formattedCode = await lint(originalTemplate);
    return { start: node.start!, end: node.end!, replacement: formattedCode };
  }));

  const outputCode = applyEdits(originalCode, edits);
  const highlightedCode = highlight(outputCode, { language: 'typescript', ignoreIllegals: true });

  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.promises.writeFile(outputPath, outputCode);
  console.log(`Linted code saved to: ${outputPath}`);

}

function applyEdits(code: string, edits: { start: number; end: number; replacement: string }[]): string {
  edits.sort((a, b) => b.start - a.start); 
  for (const edit of edits) {
    code = code.substring(0, edit.start) + edit.replacement + code.substring(edit.end);
  }
  return code;
}

processFile('exhibitA.js', 'tsx', './output.ts').catch(console.error);
