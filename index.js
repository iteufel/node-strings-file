var fs = require('fs');

function parse(data, wantComments) {
  var re = /(?:\/\*(.+)\*\/\n)?(.+)\s*\=\s*\"(.+)\"\;\n/gmi; 
  var res = {}
  while ((m = re.exec(data)) !== null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    if (m[2].substring(0,1)=='"') {
     m[2] = m[2].trim().slice(1, -1);
    }
    if (wantComments) {
      res[m[2]] = {
        value: unescapeString(m[3]),
        comment: m[1] || ''
      };
    }else {
      res[m[2]] = unescapeString(m[3]);
    }
  }
  return res;
}

function compile(obj) {
  var data = '';
  for (var i in obj) {
    if (typeof obj[i] == 'object') {
      if (obj[i]['comment'] && obj[i]['comment'].length > 0) {
        data += '\n\/*' + obj[i]['comment'] + '*\/\n';
      }
      data += '"' + i + '" = ' + '"' + obj[i]['value'] + '";\n';
    }else if (typeof obj[i] == 'string') {
      data += '"' + i + '" = ' + '"' + obj[i] + '";\n';
    }
  }
  return data;
}

function escapeString(str) {
  return str.replace(/\"/gmi,'\\\"');
}

function unescapeString(str) {
  return str.replace(/\\\"/gmi,'\"');
}

function readStrings(file, callback, wantComments) {
  fs.readFile(file, 'ucs2', function (err, data) {
    if (err) {
      callback(err, null);
    }else {
      callback(null, parse(data, wantComments));
    }
  })
}

function readStringsSync(file, wantComments) {
  var data = fs.readFileSync(file, 'ucs2');
  return parse(data, wantComments);
}

function writeStrings(obj, filename, callback) {
  fs.writeFile(filename, compile(obj), 'ucs2', callback);
}

function writeStringsSync(obj, filename) {
  return fs.writeFileSync(filename, compile(obj));
}

exports.readStrings = readStrings;
exports.readStringsSync = readStringsSync;
exports.writeStrings = writeStrings;
exports.writeStringsSync = writeStringsSync;
exports.parse = parse;
exports.compile = compile;