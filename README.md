# Angular Test (spec) Schematic

An Angular Schematic that creates test snippets of code for existing Angular components and services

## To use

See the DEV-NOTES.md for the steps to setup this project and copy into an existing CLI project to generate specs and imports.

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with
```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```
 
