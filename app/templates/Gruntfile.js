module.exports = function (grunt) {
	'use strict';

	require('time-grunt')(grunt);
	
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		date: grunt.template.today('yyyy-mm-dd'),

		path: {
			src: 'source',
			dev: 'html',
			build: 'build',
			doc: 'doc',
			layouts: '<%%= path.src %>/layouts',
			pages: '<%%= path.src %>/pages',
			data: '<%%= path.src %>/data',
			bower: 'bower_components',
			reports: '<%%= path.build %>/<%%= path.date %>/build'
		},

		bower: {
			install: {
				options: {
					copy: false
				}
			}
		},

		copy: {
			bower: {
				files: [
					{
						expand: true,
						flatten: true,
						src: ['<%%= path.bower %>/**/*.js'],
						dest: '<%%= path.dev %>/assets/js/lib'
					},
					{
						expand: true,
						flatten: true,
						src: ['<%%= path.bower %>/**/*.css'],
						dest: '<%%= path.dev %>/assets/css/lib'
					}
				]
			},
			sass: {
				expand: true,
				flatten: true,
				cwd: '<%%= path.src %>/assets/css',
				src: ['*.css'],
				dest: '<%%= path.dev %>/assets/css'
			},
			js: {
				expand: true,
				flatten: true,
				cwd: '<%%= path.src %>/assets/js',
				src: ['*.js'],
				dest: '<%%= path.dev %>/assets/js'
			},
			img: {
				expand: true,
				cwd: '<%%= path.src %>/assets/images',
				src: ['**/*.*'],
				dest: '<%%= path.dev %>/assets/images'
			},
			build: {
				options: {
					expand: true,
					flatten: true
				},
				files: [
					{
						src: [
							'<%%= path.dev %>/**',
							'!<%%= path.dev %>/assets/images/dummy/**'
						],
						dest: '<%%= path.build %>/<%%= date %>/'
					},
					{
						src: [
							'<%%= path.src %>/**',
							'!<%%= path.src %>/**/*.hbs',
							'!<%%= path.src %>/data/**',
							'!<%%= path.src %>/assets/images/dummy/**',
							'!<%%= path.layouts %>/**',
							'!<%%= path.pages %>/**',
						],
						dest: '<%%= path.build %>/<%%= date %>/'
					},
					{
						src: ['<%%= path.doc %>/js/**'],
						dest: '<%%= path.build %>/<%%= date %>/'
					}
				]
			}
		},

		assemble: {
			options: {
				flatten: true,
				data: '<%%= path.data %>/*',
				layoutdir: '<%%= path.layouts %>',
				layout: 'default.hbs',
				partials: ['<%%= path.layouts %>/partials/**/*.hbs'],
				basepath: '<%%= path.basepath %>',
				production: false
			},
			dev: {
				options: {
					layout: 'default.hbs'
				},

				// ディレクトリ毎に分けて定義
				files: [
					{
						expand: true,
						cwd: '<%%= path.src %>/',
						src: 'index.hbs',
						dest: '<%%= path.dev %>'
					},
					{
						expand: true,
						cwd: '<%%= path.pages %>/',
						src: '*.hbs',
						dest: '<%%= path.dev %>'
					}
				]
			},
			prod: {
				options: {
					production: true,
					layout: 'default.hbs'
				},
				files: [
					{
						expand: true,
						cwd: '<%%= path.src %>/',
						src: 'index.hbs',
						dest: '<%%= path.dev %>'
					},
					{
						expand: true,
						cwd: '<%%= path.pages %>/',
						src: '*.hbs',
						dest: '<%%= path.dev %>'
					}
				]
			}
		},

		htmlhint: {
			options: {
				htmlhintrc: '.htmlhintrc',
				force: true
			},
			dev: {
				src: ['<%%= path.src %>/!(index|headers).html']
			},
			prod: {
				options: {
					formatters: [
						{
							id: 'checkstyle',
							dest: '<%%= path.reports %>/htmlhint.xml'
						}
					]
				},
				src: ['!<%%= path.src %>/!(index|headers).html']
			}
		},

		htmlmin: {
			options: {
				collapseBooleanAttributes: true,
				collapseWhitespace: true,
				removeComments: true,
				removeEmptyAttributes: true,
				removeOptionalTags: true,
				removeRedundantAttributes: true
			},
			min: {
				files: [
					{
						expand: true,
						cwd: '<%%= path.src %>/',
						src: '**/*.html',
						dest: '<%%= path.dist %>/'
					}
				]
			}
		},

		compass: {
			dist: {
				options: {
					sassDir: '<%%= path.src %>/assets/scss',
					cssDir: '<%%= path.src %>/assets/css'
				},
			}
		},

		sass: {
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%%= path.src %>/assets/css/scss',
						src: '*.scss',
						dest: '<%%= path.src %>/assets/css',
						ext: '.css'
					}
				]
			}
		},

		autoprefixer: {
			options: {
				browsers: ['last 2 version', '> 1%', 'ie 8']
			},
			all: {
				src: '<%%= path.src %>/**/*.css'
			}
		},

		csslint: {
			options: {
				csslintrc: '.csslintrc',
				force: true
			},
			dev: {
				src: ['<%%= path.src %>/**/*.css']
			},
			prod: {
				options: {
					formatters: [
						{
							id: 'checkstyle-xml',
							dest: '<%%= path.reports %>/csslint.xml'
						}
					]
				},
				src: ['<%%= path.src %>/**/*.css']
			}
		},

		cssmin: {
			options: {
				report: 'gzip'
			},
			min: {
				files: [
					{
						expand: true,
						cwd: '<%%= path.src %>/',
						src: '**/*.css',
						dest: '<%%= path.dist %>/'
					}
				]
			}
		},

		styleguide: {
			options: {
				name: '<%%= pkg.name %>',
				template: {
					include: ['<%%= path.src %>/css/common.css', '<%%= path.src %>/js/common.js']
				}
			},
			assets: {
				files: {
					'<%%= path.styleguide %>': ['<%%= path.src %>/assets/css/*.scss']
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				force: true,
				reporter: require('jshint-stylish')
			},
			dev: {
				src: ['<%%= path.src %>/assets/js/modules/*.js']
			},
			prod: {
				options: {
					reporter: 'checkstyle',
					reporterOutput: '<%%= path.reports %>/jshint.xml'
				},
				src: ['<%%= path.src %>/assets/js/modules/*.js']
			}
		},

		browserify: {
			options: {
				expand: true,
				noParse: ['<%%= path.dev %>/assets/js/lib/jquery.js']
			},
			compile: {
				files: {
					'<%%= path.src %>/assets/js/index.js': ['<%%= path.src %>/assets/js/bundle/index.js']
				}
			}
		},

		uglify: {
			options: {
				preserveComments: 'some',
				report: 'gzip'
			},
			min: {
				files: [
					{
						expand: true,
						cwd: '<%%= path.src %>/',
						src: 'js/!(html5shiv|respond.min).js',
						dest: '<%%= path.dist %>/'
					}
				]
			}
		},

		sprite: {
			create: {
				src: '<%%= path.src %>/img/sprites/*',
				destImg: '<%%= path.src %>/img/sprite.png',
				destCSS: '<%%= path.build %>/css/sprite.scss',
				imgPath: '../img/sprite.png',
				algorithm: 'binary-tree'
			}
		},

		imagemin: {
			min: {
				files: [
					{
						expand: true,
						cwd: '<%%= path.src %>/',
						src: ['**/*.{png,jpg,jpeg}', '!img/sprites/**'],
						dest: '<%%= path.dist %>/'
					},
					{
						expand: true,
						cwd: '<%%= path.src %>/',
						src: '**/*.{png,jpg,jpeg}',
						dest: '<%%= path.dist %>/'
					}
				]
			}
		},

		compress: {
			dist: {
				options: {
					archive: '<%%= path.build %>/assets.zip'
				},
				expand: true,
				cwd: '<%%= path.dist %>/',
				src: ['**/*'],
				dest: 'assets/'
			}
		},

		connect: {
			options: {
				port: 9000,
				livereload: 35729,
				open: true
			},
			livereload: {
				options: {
					base: ['<%%= path.dev %>']
				}
			}
		},

		watch: {
			options: {
				spawn: false,
				livereload: '<%%= connect.options.livereload %>'
			},
			html: {
				files: ['<%%= path.src %>/**/*.{hbs,md}', '<%%= path.layouts %>/**', '<%%= path.data %>/**'],
				tasks: ['newer:assemble:dev']
			},
			css: {
				files: ['<%%= path.src %>/**/*.scss'],
				tasks: ['newer:compass', 'newer:autoprefixer', 'newer:copy:sass']
			},
			js: {
				files: ['<%%= path.src %>/**/*.js'],
				tasks: ['newer:browserify', 'jshint:dev', 'newer:copy:js']
			}
		},

		yuidoc: {
			compile: {
				name: '<%%= pkg.name %>',
				description: '<%%= pkg.description %>',
				version: '<%%= pkg.version %>',
				url: '<%%= pkg.homepage %>',
				options: {
					paths: '<%%= path.src %>/assets/js/',
					outdir: '<%%= path.doc %>/js',
					exclude: 'lib'
				}
			}
		},

		prettify: {
			options: {
				indent: 1,
				indent_char: '	',
				unformatted: ['a', 'i', 'b', 'em', 'span']
			},
			all: {
				files: [
					{
						expand: true,
						cwd: '<%%= path.dev %>/',
						src: ['**/*.html'],
						dest: '<%%= path.dev %>/'
					}
				]
			}
		}
		
	});


	require('load-grunt-tasks')(grunt, {
		pattern: ['grunt-*', 'assemble']
	});

	grunt.registerTask('default', ['compile:dev', 'lint:dev']);
	grunt.registerTask('install', ['newer:bower:install', 'newer:copy:bower']);
	grunt.registerTask('compile:dev', ['newer:assemble:dev', 'newer:compass', 'newer:browserify', 'newer:prettify']);
	grunt.registerTask('compile:prod', ['newer:assemble:prod', 'newer:compass', 'newer:browserify', 'newer:prettify']);
	grunt.registerTask('doc', ['yuidoc']);
	grunt.registerTask('lint:dev', ['htmlhint:dev', 'csslint:dev', 'jshint:dev']);
	grunt.registerTask('lint:prod', ['htmlhint:prod', 'csslint:prod', 'jshint:prod']);
	grunt.registerTask('serve', ['compile:dev', 'lint:dev', 'newer:copy:sass', 'newer:copy:js', 'newer:copy:img', 'connect', 'watch']);
	grunt.registerTask('build', ['compile:prod', 'lint:prod', 'doc', 'copy:build']);
};
