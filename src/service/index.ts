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

export function service(options: SpecsOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    console.log('-- call service Rule');
    return tree;
  };
}
