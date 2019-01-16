import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('service schematics', () => {
  it('generates service tree', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic('service', {}, Tree.empty());

    expect(tree.files).toEqual(['/public/s-spec.ts', '/public/s-imports.ts']);
  });
});
