import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  chain,
  mergeWith,
  schematic,
  template,
  url,
} from '@angular-devkit/schematics';

import { SpecsOptions } from '../specs/schema';
import { ImportsService } from '../utils/imports.service';

export function imports(options: SpecsOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {

    const importsService = new ImportsService(tree, options);

    // Extract existing imports
    options.tmpl = {
      imports: importsService.extractImports()
    };

    return tree;
  };
}
