import * as ts from 'typescript';

import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  chain,
  mergeWith,
  schematic,
  template,
  url,
} from '@angular-devkit/schematics';

import { getSourceNodes } from './schematics-angular-utils/ast-utils';
import { SpecsOptions } from '../specs/schema';

export class ImportsService {

  constructor(private host: Tree, private options: SpecsOptions) {
  }

  extractImports(): string[] {
    console.log('-- extract imp node', this.options.name);
    let text = this.host.read(this.options.name || '');
    if (!text) {
      throw new SchematicsException(`File ${this.options.name} does not exist.`);
    }
    let sourceText = text.toString('utf-8');

    let sourceFile = ts.createSourceFile(
      this.options.name || '', sourceText, ts.ScriptTarget.Latest, true /* setParentNodes */
    );

    let nodes = getSourceNodes(sourceFile);
    const imps: string[] = [];

    // Build array of imports
    nodes
      .filter(node => node.kind === ts.SyntaxKind.ImportDeclaration)
      .map((node: ts.ImportDeclaration) => {
        imps.push(this.convertImport(node));
      });
    nodes
      .filter(node => node.kind === ts.SyntaxKind.ExternalModuleReference)
      .map((node: ts.ExternalModuleReference) => {
        imps.push(this.convertExternalModuleReference(node));
      });
    return imps;
  }

  // Eg import foobar = require('foobar')
  convertExternalModuleReference(node: ts.ExternalModuleReference) {
    // const alias = node.name;
    // const mod = node.moduleReference.expression;
    console.log('-- external module alias, mod', node);
    return ''; // import ' + alias + ' = require(\'' + mod + '\');';
  }

  convertImport(node: ts.ImportDeclaration): string {
    console.log('-- convert imp node');

    const modSpec = node.moduleSpecifier;
    let sLiteral: ts.StringLiteral = modSpec as ts.StringLiteral;

    const modPath: string = sLiteral ? sLiteral.text : '';

    if (!node.importClause) {
      // Format: import 'path'
      if (modSpec) {
        return this.stringImport(sLiteral);
      }
      return '';
    }

    const namedBinding = node.importClause.namedBindings;
    const clauseName = node.importClause.name;

    if (clauseName) {
      // Format: import Name from 'path'
      return this.simpleNameImport(node.importClause);
    }

    if (namedBinding) {

      if (namedBinding.kind === ts.SyntaxKind.NamespaceImport) {
        // Format: import * as name from 'path'
        const nsImport = namedBinding as ts.NamespaceImport;
        return this.namespaceImport(nsImport, modSpec);
      }

      // Format: import {a,b,c} from 'path'
      const namedImport = namedBinding as ts.NamedImports;
      return this.namedImports(namedImport, modPath);
    }

    return '';
  }

  private simpleNameImport(importClause: any) {
    console.log('-- simple name import', importClause.name, importClause);
    return importClause.name.text;
  }

  // Format: `import {a,b,c} from 'path'`
  private namedImports(node: ts.NamedImports, modPath: string): string {
    /*
    const ni = node.elements
          .map((is: ts.ImportSpecifier) => is.propertyName ? is.propertyName.text : is.name.text)
          .reduce((acc: {[name: string]: string}, curr: string) => {
            acc[curr] = modPath;
            return acc;
          }, {});
    console.log('-- named import', ni);
    */
    const specs = this.specifiers(node.elements);
    console.log('-- named import specs', specs);
    return '';
  }

  // Import a whole NS, eg import * as foobar from 'foobar';
  private namespaceImport(node: ts.NamespaceImport, modSpec): string {
    console.log('-- ns import', modSpec, node);
    const t: string[] = [];
    /*
    if (node.alias) {
      t.push('import * as ' + node.alias + ' from \'' + modSpec + '\';');
    } else {
      t.push('import * from \'' + modSpec + '\';');
    }
    */
    return t.join('');
  }

  // Eg import 'rxjs/stuff';
  private stringImport(node: ts.StringLiteral): string {
    console.log('-- string import', node);
    return '';
  }

  private specifiers(specs, braces = true): string {
    const symSpecs = [];
    for (let spec of specs) {
      symSpecs.push(this.specifier(spec));
    }
    const syms = symSpecs.join(', ');
    if (braces) {
      return '{' + syms + '}';
    }
    return syms;
  }

  private specifier(spec): string {
    console.log('-- spec for ', spec);
    if (spec.alias) {
      return spec.specifier + ' as ' + spec.alias;
    }
    return spec.specifier;
  }
}
