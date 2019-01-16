import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('component schematics', () => {
  it('generates component tree', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic('component', {}, Tree.empty());

    expect(tree.files).toEqual(['/public/c-spec.ts', '/public/c-imports.ts']);
  });
});
