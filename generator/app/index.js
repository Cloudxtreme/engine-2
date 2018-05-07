const Generator = require('yeoman-generator');
const lodash = require('lodash');
const lucidVersion = require('../package').version;
const fs = require('fs');
const path = require('path');
var glob = require('glob-fs')();


module.exports = class extends Generator {

    prompting() {
        return this.prompt([
            {
                type: 'input',
                name: 'worldName',
                message: 'What is the name of your world?'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Give your world a short description:'
            },
            {
                type: 'input',
                name: 'license',
                message: 'What license do you want to use for your source?',
                default: 'MIT'
            }
        ])
            .then((answers) => {
                this.worldName = answers.worldName;
                this.description = answers.description;
                this.license = answers.license
            })
    }

    setDestinationRoot() {
        this.destinationRoot(`./${lodash.snakeCase(this.worldName)}`)
    }

    packageJson() {
        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath('package.json'),
            {
                worldName: this.worldName,
                lucidVersion,
                description: this.description,
                license: this.license
            }
        )
    }

    env() {
        this.fs.copyTpl(
            this.templatePath('env'),
            this.destinationPath('.env'),
            {
                worldName: this.worldName,
            }
        )
    }

    knex() {
        this.fs.copyTpl(
            this.templatePath('config/knexfile.js'),
            this.destinationPath('config/knexfile.js')
        )
    }

    config() {
        this.fs.copyTpl(
            this.templatePath('config/config.js'),
            this.destinationPath('config/config.js')
        );
        this.fs.copyTpl(
            this.templatePath('config/portal.config.js'),
            this.destinationPath('config/portal.config.js')
        );
        this.fs.copyTpl(
            this.templatePath('config/world.config.js'),
            this.destinationPath('config/world.config.js')
        );
    }

    migrations() {
        this.fs.copy(this.templatePath("migrations"), "migrations")
    }
};
