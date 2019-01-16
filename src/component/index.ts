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

export function component(options: SpecsOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    console.log('-- call component Rule');
    return tree;
  };
}
