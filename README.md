#node-strings-file


Node.js module for processing `utf-16` ios/osx `.strings` files.

## Installing with [npm](http://npmjs.org/)

	$ npm install strings-file

## Usage
### readStrings(filename, callback, withComments)
	// Require strings-file
	var StringsFile = require('strings-file');
	
	StringsFile.readStrings('Localizable.strings', function(err, data){
		console.log(data);
	});

### readStringsSync(filename, withComments)
	var StringsFile = require('strings-file');

	var data = StringsFile.readStringsSync('Localizable.strings', true);
	console.log(data);

### writeStrings(filename, data, callback)
	var StringsFile = require('strings-file');

	var data = {
		'key_0': 'value_0',
		'key_1': 'value_1'
	};
	
	StringsFile.writeStrings('Localizable.strings', data, function(err){
		if(!err){
			console.log('File written');
		}
	});

### writeStringsSync(filename, data)
	var StringsFile = require('strings-file');
	
	var data = {
		'key_0': {value:'value_0',comment:'comment_0'},
		'key_1': {value:'value_1',comment:'comment_1'}
	};
	StringsFile.writeStringsSync('Localizable.strings', data);

### parse(input, withComments)
	var StringsFile = require('strings-file');

	// A string in the .strings file format
	var input = '"key" = "value";'
	
	var data = StringsFile.parse(input, false);

### compile(data, [options])
	var StringsFile = require('strings-file');

	var data = {
		'key_0': 'value_0',
		'key_1': 'value_1'
	};
	
	var str = StringsFile.compile(data);

	data = {
		'key_0': { 'value' : 'value_0', 'comment' : 'comment_0' },
		'key_1': { 'value' : 'value_1', 'comment' : 'comment_1' }
	};

	var str = StringsFile.compile(data);    