module.exports = function(grunt) {

    // project configuration
    grunt.initConfig({

        // Copying static resources/libraries
        copy: {
            main: {
                files: [
                    { src: ['**/*.html'], dest: 'build/', expand: true, cwd: 'src/html'},
                    { src: ['**/*.js'], dest: 'build/scripts', expand: true, cwd: 'src/scripts'},
                    { src: ['**/*.css'], dest: 'build/styles', expand: true, cwd: 'src/styles'},
                    { src: ['**/*.png'], dest: 'build/images', expand: true, cwd: 'src/images'}
                ]
            }
        },

        // Watching changes to trigger the matching task(s)
        watch: {
            grunt: {
                files: ['./gruntfile.js']
            },
            copy: {
                files: ['src/**/*.*'],
                tasks: ['copy']
            }
        }
    });

    // load required npm task modules
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // $ grunt || $ grunt default
    grunt.registerTask('default', ['copy', 'watch']);

    // $ grunt build
    grunt.registerTask('build', ['copy']);

};
