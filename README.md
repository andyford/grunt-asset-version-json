# grunt-asset-version-json

> Rename assets files with hash and store in a JSON file

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-asset-version-json --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-asset-version-json');
```

## NOTE
This plugin is a modified version of [grunt-wp-assets by Hariadi Hinta](https://github.com/hariadi/grunt-wp-assets) (Thank you, Hariadi Hinta!). Much is carried over from his plugin, but instead of modifying a WordPress-specific functions.php file with file hashes, the file hashes are saved to a JSON file like so: `{ "path/to/file.ext": "SOMEHASH", "path/to/other-file.ext": "SOMEHASH" }`.

The idea is to remove the burden of storing file hashes from a WordPress-specific file and into a more universal and single-purpose JSON file so this plugin should be usable outside the context of WordPress projects. To access the JSON file from WordPress/PHP, I use something like:

```php
$json = file_get_contents(get_template_directory() . '/filerevs.json');
$filerevs = json_decode($json, true);
wp_register_script('mysite-scripts', get_template_directory_uri() . '/assets/js/scripts.min.' . $filerevs['assets/js/scripts.min.js'] . '.js', false, null, true);
wp_register_style('mysite-style', get_template_directory_uri() . '/assets/css/style.min.' . $filerevs['assets/css/style.min.css'] . '.css', false, null);
```

(the above example assumes that the file hashes are stored to a JSON file named `filerevs.json`. The JSON file is defined in the `dest` property of the `asset_version_json` task config)

## Usage Example


```javascript
asset_version_json: {
  assets: {
    options: {
      algorithm: 'sha1',
      length: 8,
      format: false,
      rename: true
    },
    src: 'assets/css/main.min.css',
    dest: 'filerevs.json'
  }
},
```

This example task will rename `assets/css/main.min.css` to `assets/css/main.min.{sha1hash}.css` and update assets reference in `filerevs.json` which would look something like `{ "assets/css/main.min.css": "SOMEHASH" }`;

## Caveats

If the JSON file defined by the `dest` property does not exist, then it will fail. Also if the file exists but does not already contain a JSON object (at least `{}`), then it will fail.


## Options

### rename

Type: `Boolean`
Default: `false`

It will rename the `src` target instead of copy.

### format

Type: `Boolean`
Default: `true`

File name format.
```
true: {hash}.{filename}.{ext}
false: {filename}.{hash}.{ext}
```

### encoding

Type: `String`
Default: `'utf8'`

The file encoding.

### algorithm

Type: `String`
Default: `'md5'`

`algorithm` is dependent on the available algorithms supported by the version of OpenSSL on the platform. Examples are `'sha1'`, `'md5'`, `'sha256'`, `'sha512'`, etc. On recent releases, `openssl list-message-digest-algorithms` will display the available digest algorithms.

### length

Type: `Number`
Default: `4`

The number of characters of the file hash to prefix the file name with.


## Release History

 * 2013-11-21   v0.1.4   Update readme php/wordpress example
 * 2013-11-21   v0.1.3   track full file pathnames as supplied to the 'src' property rather than using the base filename
 * 2013-11-21   v0.1.2   Track hashes by individual file rather than by filetype
 * 2013-11-21   v0.1.1   Update readme
 * 2013-11-21   v0.1.0   Initial commit.
