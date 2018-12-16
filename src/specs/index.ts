import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { apply, filter, move, template, url, branchAndMerge, chain, mergeWith } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

// import { parseName } from '@schematics/angular/utility/parse-name';
// import { getWorkspace } from '@schematics/angular/utility/config';

import { SpecsOptions } from './schema';

const supportedExtensions = ['ts'];

function filterTemplates(): Rule {
  return filter(path => !!path.match(/\-imports\.ts$/) || !!path.match(/-spec\.ts$/));
}

function setupOptions(options: SpecsOptions) {
  const ftype = options.name.match(/\.service\.ts$/) ? 's-' : 'c-';
  options.importPath = `${ftype}imports.ts`;
  options.specPath = `${ftype}spec.ts`;
  options.path = './public';
}

// Specs Factory
export function specs(options: SpecsOptions): Rule {
  return (host: Tree, context: SchematicContext) => {

    if (supportedExtensions.indexOf(options.name) === -1) {
      // throw! not supported
    }

    setupOptions(options);

    const templateSource = apply(url('./files'), [
      filterTemplates(),
      template({
        ...strings,
        ...options
      }),
      move(options.path || './public')
    ]);

    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource)
      ]))
    ]);

    return rule(host, context);
  };
}
