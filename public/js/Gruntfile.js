module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        concat : {
            options : {
                seperator : ';'
            },
            dist : {
                src     : [
                    "src/header.js",
                    "src/core.js",
                    "src/modules/**/*.js",
                    "src/footer.js",
					"src/globals.js"
                        ],
                
                dest    : 'dist/<%= pkg.name %>.js'
            }
        },
        
        jshint : {
            options : {
                globals : {
                    console : true
                }
            },
            
            dev: [
					"src/globals.js",
                    "src/core.js",
                    "src/modules/**/*.js",
                ],

            dist : ['<%= concat.dist.dest %>']
        },
        
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files : {
                    // target : source
                    'dist/<%= pkg.name %>.min.js' : ['<%= concat.dist.dest %>']
                }
            }
        },
        
        jsbeautifier : {
            files : ['<%= concat.dist.dest %>']
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    

    // Default task(s).
    grunt.registerTask('default', ['concat:dist', 'jsbeautifier', 'jshint:dist', 'uglify:dist']);
    grunt.registerTask('lint', ['jshint:dev']);

};