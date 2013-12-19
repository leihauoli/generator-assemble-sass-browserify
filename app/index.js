'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var AssembleSassBrowserifyGenerator = module.exports = function AssembleSassBrowserifyGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	this.on('end', function () {
		this.installDependencies({ skipInstall: options['skip-install'] });
	});

	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AssembleSassBrowserifyGenerator, yeoman.generators.Base);

AssembleSassBrowserifyGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

	// have Yeoman greet the user.
	console.log(this.yeoman);

	var prompts = [{
		name: 'name',
		message: 'What do you want to call this project?'
	}];

	this.prompt(prompts, function (props) {
		this.name = props.name;

		cb();
	}.bind(this));
};

AssembleSassBrowserifyGenerator.prototype.app = function app() {
	this.copy('_package.json', 'package.json');
	this.copy('_bower.json', 'bower.json');

	this.mkdir('source');
	this.mkdir('source/assets');
	this.mkdir('source/assets/css');
	this.mkdir('source/assets/images');
	this.mkdir('source/assets/js');
	this.mkdir('source/assets/scss');
	this.mkdir('source/assets/js/bundle');
	this.mkdir('source/data');
	this.mkdir('source/layouts');
	this.mkdir('source/layouts/partials');
	this.mkdir('source/pages');
};

AssembleSassBrowserifyGenerator.prototype.projectfiles = function projectfiles() {
	this.copy('jshintrc', '.jshintrc');
	this.copy('htmlhintrc', '.htmlhintrc');
	this.copy('csslintrc', '.csslintrc');
	this.copy('_README.md', 'README.md');
	this.copy('gitignore', '.gitignore');
	this.template('Gruntfile.js');
};

AssembleSassBrowserifyGenerator.prototype.assemblefiles = function assemblefiles() {
	this.copy('assemble/_default.hbs', 'source/layouts/default.hbs');
	this.copy('assemble/_index.hbs', 'source/index.hbs');
	this.copy('assemble/_base.hbs', 'source/layouts/base.hbs');
	this.copy('assemble/_default.hbs', 'source/layouts/default.hbs');
	this.copy('assemble/_head.hbs', 'source/layouts/partials/head.hbs');
	this.copy('assemble/_scripts.hbs', 'source/layouts/partials/scripts.hbs');
	this.copy('assemble/_header.hbs', 'source/layouts/partials/header.hbs');
	this.copy('assemble/_footer.hbs', 'source/layouts/partials/footer.hbs');
};

AssembleSassBrowserifyGenerator.prototype.scssfiles = function scssfiles() {
	this.copy('scss/_common.scss', 'source/assets/scss/common.scss');
};

AssembleSassBrowserifyGenerator.prototype.browserifyfiles = function browserifyfiles() {
	this.copy('js/_index.js', 'source/assets/js/bundle/index.js');
};
