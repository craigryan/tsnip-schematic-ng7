
Notes on creating this tsnip generator.

Tutorial on setup: https://www.softwarearchitekt.at/post/2017/12/01/generating-angular-code-with-schematics-part-ii-modifying-ngmodules.aspx
Additional tips: https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2

* Setup

    $ npm i -g @angular-devkit/schematics-cli
    $ schematics schematic --name tsnip-schematic

* Custom

    $ cd tsnip-schematic
    edit package.json, change dependencies to devDependencies

    $ npm i

    edit src/collections.json remove all comments ('//' lines, causes subsequent commands to fail with 'invalid JSON')

    Leave the src/my-xxx example schematics for now, as reference.
    Edit src/collections.json and remove sample entries

* Create a new empty schematic

    $ schematics blank --name=specs --dry-run   (remove --dry-run to gen for real)
    CREATE /src/specs/index.ts (312 bytes)
    CREATE /src/specs/index_spec.ts (460 bytes)
    ...

* Edit the new schematic, implement the generator

    Follow the tutorial links above

* Build

    $ npm run build
    .. fix compilation failures
    
* Prepare a sample CLI project to run the generator on

    $ cd ..
    $ ng new tsnip-cli-project
    $ cd tsnip-cli-project
    $ npm i

* Place the new schematic into the sample cli project node_modules so 'ng' can find it

    $ mkdir node_modules/tsnip
    $ cp ../tsnip-schematic/'everything but node_modules' node_modules/tsnip

* Run the generator and check ./public for output

    $ cd tsnip-cli-project
    $ ng g tsnip:specs --name=src/app/app.component.ts
    CREATE public/component/test-imports.ts (184 bytes)
    CREATE public/component/test-spec.ts (29 bytes)


