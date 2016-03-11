var fs = require('fs');

function parse(data, wantComments) {
  if (data.indexOf('\n')=== -1) {
    data += '\n';
  }
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
      data += '"' + i + '" = ' + '"' + escapeString(obj[i]['value']) + '";\n';
    }else if (typeof obj[i] == 'string') {
      data += '\n"' + i + '" = ' + '"' + escapeString(obj[i]) + '";\n';
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

function writeStrings(filename, data, callback) {
  fs.writeFile(filename, compile(data), 'utf8', callback);
}

function writeStringsSync(filename, data) {
  return fs.writeFileSync(filename, compile(data));
}

exports.readStrings = readStrings;
exports.readStringsSync = readStringsSync;
exports.writeStrings = writeStrings;
exports.writeStringsSync = writeStringsSync;
exports.parse = parse;
exports.compile = compile;