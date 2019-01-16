import {
  Rule, SchematicContext, Tree, schematic,
  noop, apply, filter, move, template, url, branchAndMerge, chain, mergeWith,
  SchematicsException
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

// import { parseName } from '@schematics/angular/utility/parse-name';
// import { getWorkspace } from '@schematics/angular/utility/config';

import { imports } from '../imports/index';
import { service } from '../service/index';
import { component } from '../component/index';
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

  if (options.tests) {
    if (ftype === 's-') {
      options.service = true;
      options.component = false;
    }
    if (ftype === 'c-') {
      options.service = false;
      options.component = true;
    }
  }
}

// Specs Factory
export function specs(options: SpecsOptions): Rule {
  return (host: Tree, context: SchematicContext) => {

    if (supportedExtensions.indexOf(options.name) === -1) {
      // throw! not supported
    }

    setupOptions(options);

    const text = host.read(options.name);
    if (text === null) {
      throw new SchematicsException(`Source file ${options.name} does not exist.`);
    }
    const sourceText = text.toString('utf-8');

    // Apply Rules to a Source -> new Source
    const templateSource = apply(url('./files'), [
      filterTemplates(),
      template({
        ...strings,
        ...options
      }),
      move(options.path || './public')
    ]);

    // Concat Rules -> combined Rule
    const rule = chain([
      options.imports ? imports(options) : noop(),
      options.service ? service(options) : noop(),
      options.component ? component(options) : noop(),
      mergeWith(templateSource)
    ]);

    return rule(host, context);
  };
}
