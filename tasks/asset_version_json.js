/*
 * grunt-asset-version-json
 * https://github.com/andyford/grunt-asset-version-json
 *
 * Based on:
 * https://github.com/hariadi/grunt-assets-wp
 *
 * Copyright (c) 2013 Andy Ford
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs')
  , path = require('path')
  , crypto = require('crypto');

module.exports = function(grunt) {

  grunt.registerMultiTask('asset_version_json', 'Rename assets files with hash and store hashes in a JSON file', function() {

    var dest = this.data.dest
      , options = this.options({
          encoding: 'utf8',
          algorithm: 'md5',
          format: true,
          length: 4,
          rename: false,
          filetype: 'default'
        });

    this.files.forEach(function(files) {

      files.src.forEach(function (file) {

        if (file.length === 0) {
          grunt.log.warn('src does not exist');
          return false;
        }

        var basename = path.basename
          , name = basename(file)
          , content = grunt.file.read(file)
          , hash = crypto.createHash(options.algorithm).update(content, options.encoding).digest('hex')
          , jsoncontent = grunt.file.readJSON(dest)
          , suffix = hash.slice(0, options.length)
          , ext = path.extname(file)
          , newName = options.format ? [suffix, basename(file, ext), ext.slice(1)].join('.') : [basename(file, ext), suffix, ext.slice(1)].join('.');

        // Copy/rename file base on hash and format
        var resultPath = path.resolve(path.dirname(file), newName);
        if (options.rename) {
          fs.renameSync(file, resultPath);
        } else {
          grunt.file.copy(file, resultPath);
        }
        grunt.log.writeln('  ' + file.grey + (' changed to ') + newName.green);

        // Write new hashes to revs/hashes tracking JSON file
        jsoncontent[options.filetype] = suffix;
        grunt.file.write(dest, JSON.stringify(jsoncontent, null, 2));
        grunt.log.writeln('  ' + dest.grey + (' updated with with ' + options.filetype + ' hash: ') + suffix.green);
      });
    });
  });
};
