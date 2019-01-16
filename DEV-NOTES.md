
# Notes on creating this tsnip generator.

While this guide refers to the implementation of the generator itself, the details
specifically about copying and running the generator in an existing CLI project can be applied to using the generator in your own CLI projects.

## References

Tutorial on setup:
       https://www.softwarearchitekt.at/post/2017/12/01/generating-angular-code-with-schematics-part-ii-modifying-ngmodules.aspx

Additional tips: 

   https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2

Schematics API documentation. Brief but useful:

   https://www.npmjs.com/package/@angular-devkit/schematics

## Setup

```bash
$ npm i -g @angular-devkit/schematics-cli
$ schematics schematic --name tsnip-schematic
```

## Customise

```bash
$ cd tsnip-schematic
```

Edit package.json, change dependencies to devDependencies

```bash
$ npm i
```

Edit src/collections.json remove all comments ('//' lines, causes subsequent commands to fail with 'invalid JSON')

Keep the src/my-xxx example schematics for now, as reference.

Edit src/collections.json and remove sample entries (these will be replaced with the following blank schematic).

## Create a new empty schematic

```bash
$ schematics blank --name=specs --dry-run   (remove --dry-run to gen for real)
CREATE /src/specs/index.ts (312 bytes)
CREATE /src/specs/index_spec.ts (460 bytes)
...
```

## Edit the new schematic, implement the generator

Follow the tutorial links above. The main goals of this project include:

  * Parse existing typescript source files.
  * Analyse the nature of the source, identify common patterns of use (HTTP calls etc).
  * Generate imports and specs for the identified Angular components, services etc.

## Build

```bash
$ npm run build
```
.. fix compilation failures
    
## Prepare a sample CLI project to run the generator on

```bash
$ cd ..
$ ng new tsnip-cli-project
$ cd tsnip-cli-project
$ npm i
```

## Link this generator project into the sample CLI project

Two approaches - copy the schematics into your CLI project, or link it.

### Copying

Copying into the CLI project's node\_modules so 'ng' can find it. Copy all file EXCLUDING the generator's node_modules directory.

```bash
$ mkdir node_modules/tsnip
$ cp ../tsnip-schematic/'everything but node_modules' node_modules/tsnip
```

### Linking

From tsnip-schematic/

```bash
$ npm link
```

Then in tsnip-cli-project

```bash
$ npm link tsnip-schematic
$ ng g tsnip-schematic:specs --name=src/app/app.component.ts
```

## Run the generator and check ./public for output

```bash
$ cd tsnip-cli-project
$ ng g tsnip:specs --name=src/app/app.component.ts
CREATE public/component/test-imports.ts (184 bytes)
CREATE public/component/test-spec.ts (29 bytes)
```

# Generator design

This Angular Schematics is constructed of a collection of named schematics, each acting on a Tree. The Tree contains a base (existing source) and staging (generated source).

Named schematics handle generation of imports and spec files and other generated artifacts (eg future HTML template generation). They consist of Rules which serve to take in a Tree and generate another Tree (such as a rule to inject imports into the Tree).

A RuleFactory creates these Rules, it takes an Option object as input and returns a Rule.

specs Rule:
   generateImports Rule:
      type? serviceImports | ComponentImports Rule:
      injectImports Change[] :
         TS parse source
         Inject existing imports and related imports
   generateSpec Rule:
      type? serviceSpec | ComponentSpec Rule:
      injectMocks Change[] :
      injectInit Change[] :
      injectDescribe Change[] :
      
