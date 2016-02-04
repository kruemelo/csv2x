// csv2x
// $ node csv2x --if=./node_modules/papaparse/tests/long-sample.csv
// $ DEBUG=csv2x node csv2x --header=1 --if=./node_modules/papaparse/tests/long-sample.csv --template=test
// for parser config see http://papaparse.com/docs
// in node context, babyparse will be used: https://www.npmjs.com/package/babyparse
(function(definition) {
  if (typeof module !== 'undefined') {

    var debug = 'csv2x' === process.env.DEBUG && require('debug')('csv2x') || function () {};
    
    // CommonJS
    if (module.parent) {
      // running as sub module
      module.exports = definition(
        require('underscore'),
        require('babyparse'),
        debug
      );
    }
    else {
      // running from cli, you may use --if=filename 
      definition(
        require('underscore'),
        require('babyparse'),
        debug
      )
      (
        (function () {
          var argv = require('minimist')(process.argv.slice(2));
          if (argv.if) {
            argv.csv = require('fs').readFileSync(argv.if, 'utf8');
          }
          if (argv.tf) {
           argv.template = require('fs').readFileSync(argv.tf, 'utf8'); 
          }
          return argv;
        })(),
        // csv2x-callback
        function (err, result) {
          if (err) {
            debug(err);
          }
          else {
            process.stdout.write(
              require('util').format.apply(null, [err || result]) + '\n'
            );                      
          }
        }
      );
    }
  }
  else if (typeof define === 'function' && typeof define.amd === 'object') {
    // AMD
    define(['underscore', 'papaparse'], definition);
  }
  else if (typeof window === 'object') {
    // DOM
    window.csv2x = definition(window._, window.Papa);
  }
}(function (_, csvParser, debug) {

  'use strict';

  debug = debug || function () {};

  var predefinedTemplates = {
    'html': '\n<tr>\n<%=Array.prototype.map.apply(row, [function (cell) { return ["  <td>", _.escape(cell), "</td>"].join(""); }]).join("\\n")%>\n</tr>',
    'test': '<%=rowIndex%>: <%=JSON.stringify(row)%>\n'
  };

  var csv2x = function (argv, callback) {
    try {

      debug('csv2x(argv)', argv);

      var resultStr = '',
        template = _.template(predefinedTemplates[argv.template] || argv.template || predefinedTemplates.html),
        rowIndex = -1,
        complete = false,
        previousResults;
      
      argv.csv = argv.csv || '';
      argv.parserConfig = {};

      argv.parserConfig.header = !!argv.header;

      function isEmptyRow (row) {
        return !row || !_.size(row) || !_.reduce(row, function (memo, cell) {
          return memo + String(cell).trim();
        }, '');
      }

      function appendResults (results) {
        debug('appendResults()', results);
        results.data.some(function (row) {
          debug('appendResults some row', row);
          try {
            resultStr += template({
              rowIndex: ++rowIndex,
              isLastRow: results.isLastRow,
              isEmptyRow: isEmptyRow(row),
              argv: argv,
              parser: results.parser,
              row: row,
              errors: results.errors,
              meta: results.meta
            });   
            debug('appended result string:', resultStr);         
          }
          catch (e) {
            debug('catched error in appendResults():', e);
            callback(e);
            return true;
          }
        });
      }

      argv.parserConfig.step = function (results, parser) {
        debug('step(results)', results);
        debug('step() previousResults', previousResults);
        if (previousResults) {
          appendResults(previousResults);
        }
        results.parser = parser;
        results.isLastRow = undefined;
        results.isEmptyRow = undefined;
        previousResults = results;
      };

      argv.parserConfig.complete = function (results) {
        debug('complete(results)', results);
        if (complete) {
          return;
        }
        complete = true;
        if (previousResults) {
          previousResults.isLastRow = true;
          appendResults(previousResults);
        }        
        callback(null, resultStr);
      }; 

      csvParser.parse(argv.csv, argv.parserConfig);
    }
    catch (e) {
      debug('catched error in csv2x():', e);
      callback(e);
    }

    return this;
  };

  return csv2x;

}));
