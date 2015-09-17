module.exports = function( grunt ) {
    var banner = '/*!\n' +
                    '* <%= pkg.name %> <%= pkg.version %>\n' +
                    '*\n' +
                    '* Date: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    '*/\n';
                    
    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),
        less: {
            dev: {
                options: {
                    //paths: ["assets/css"]
                },
                files: {
                    "dist/css/jgallery.css": "src/less/jgallery.less"
                }
            },
            min: {
                options: {
                    //paths: ["assets/css"],
                    cleancss: true
                },
                files: {
                    "dist/css/jgallery.min.css": "src/less/jgallery.less"
                }
            }
        },
        concat: ( function() {
            var src = [
                'src/js/start.frag.js',
                'src/js/base_model/**/*.js',
                'src/js/model/**/*.js',
                'src/js/directives/**/*.js',
                'src/js/start.frag.js',
                'src/js/end.frag.js'
            ];
            
            return {
                options: {
                    banner: banner
                },
                dev: {
                    src: src,
                    dest: 'dist/js/cycling-race.js'
                }
            };
        } )(),
        uglify: {
            js: {
                options: {
                    banner: banner
                },
                files: {
                    'dist/js/cycling-race.min.js': ['dist/js/cycling-race.js']
                }
            }
        },
        watch: {
            css: {
                files: ['src/**/*.less'],
                tasks: ['build-css']
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['build-js']
            }
        }
    } );
    grunt.loadNpmTasks( 'grunt-contrib-less' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.registerTask( 'build-js', ['concat:dev'] );
    grunt.registerTask( 'build-css', ['less:dev','less:min'] );
    grunt.registerTask( 'default', ['build-js', 'build-css'] );
};