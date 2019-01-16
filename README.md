# Angular Schematic for Spec Generation

Angular Schematics is a workflow tool I'm using for implementing a code generator that creates test snippets of code for existing Angular components and services. 

Schematics are directly usable through the Angular CLI, once installed you can use the usual 'ng generate' command syntac to run the generators.

This collection of schematics parses source files (.ts) within an existing Angular CLI project, analyses common patterns of use (HTTP code, rxjs logic etc)
and generates suitable imports and specs 'describes' and 'it' methods.

## To use

See the DEV-NOTES.md for the steps to setup this project and link into an existing CLI project to generate specs and imports using 'ng g'.

### Testing the generator itself

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
$ npm run build
$ npm publish
```
