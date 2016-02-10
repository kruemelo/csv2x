# csv2x

## command line usage

csv content is specified by `--csv`

```   
$ node csv2x --csv="A,B
C,D"

<tr>
<td>A<td/>
<td>B<td/>
<tr>
<tr>
<td>C<td/>
<td>D<td/>
<tr>
```

with input filename `--if` (CLI-only):
```
$ node csv2x --if=./test/test.csv
```

with template filename `--tf` (CLI-only):
```
$ node csv2x --if=./test/test.csv --tf=./test/test-template.html
```

with template option `--template` to use a predefined template:
```
$ node csv2x --if=./test/test.csv --template=test
```

with header option `--header` to handle the first csv row as field names:
```
$ node csv2x --header --if=./test/test.csv --template=test
```

with debug option:
```
$ DEBUG=csv2x node csv2x --if=./test/test.csv
$ DEBUG=csv2x,csv2x-test npm test
```


## node usage

```
const csv2x = require('csv2x');

csv2x(
  {csv: 'A,B,C\nX,Y,Z'},
  (err, html) => {
    console.log(html)
    // => '\n<tr>\n<td>A<td/>\n<td>B<td/>\n<td>C<td/>\n<tr>\n<tr>\n<td>X<td/>\n<td>Y<td/>\n<td>Z<td/>\n<tr>'
  }
);
```

convert to user defined template (applied per row, uses [underscore micro-template](http://underscorejs.org/#template))
```
csv2x(
  {
    csv: 'A,B,C\nX,Y,Z', 
    template: 'bla bla: <%=JSON.stringify(row)%>\n'
  },
  (err, result) => {
    // => result: 'bla bla: ["A","B","C"]\nbla bla: ["X","Y","Z"]\n'
  }
);
```

### node example: work with files

```
const fs = require('fs');

csv2x(
  {
    csv: fs.readFileSync('./test/test.csv', 'utf8'), 
    template: fs.readFileSync('./test/test-template.html', 'utf8'),
    header: true
  },
  (err, result) => {
    // process result..
  }
);
```


## example template file

(test/test-template.html)

```
<% if (rowIndex === 0) { %>
<html>
  <head>
    <meta charset="utf-8" />
  </head><%
} 

if(!isEmptyRow) { %>
  <h2><%-row.Title %></h2>

  <dl>
    
    <dt>id</dt>
    <dd>XX-<%-optional(row.id, 'none') %></dd>

    <dt>parent id</dt>
    <dd><%-(isEmpty(row['parent id']) ? 'none' : 'XX-' + row['parent id'])%></dd>  

    <dt>Components</dt>
    <dd><%-optional(row.Components, 'N/A') %></dd>  

    <dt>Target Version</dt>
    <dd><%-optional(row['Target Version'], 'none') %></dd>  

    <dt>Implemented Version</dt>
    <dd><%-optional(row['Implemented Version'], 'none') %></dd>  

    <dt>Issue Type</dt>
    <dd><%-optional(row['Issue Type']) %></dd>  

  </dl>

  <h3>Acceptance Criteria</h3>
  <p><pre><%-row['Acceptance Criteria'] %></pre></p>

  <h3>Details</h3>
  <p><pre><%-row['Details'] %></pre></p>

  <h3>Comments</h3>
  <p><pre><%-row['Comments'] %></pre></p><%
} 

if (isLastRow) { %>
</html><%
}
%>
```

## available template values


**rowIndex**

int current csv row index.


**isLastRow**

 boolean indicating the last csv row.


**isEmptyRow**

 boolean indicating that all cells are empty.


**isEmpty**

 function to check if cell value is empty; white spaces are considered as empty, but not numbers 0.


**optional**

 function returns a an optional value (default empty string) set as the second arg; pass test value to the first argument.


**argv**

 option hash set in csv2x(), minimist argv when running from cli.


**parser**

 csv-parser (papaparse/babyparse) instance.


**row**

 the current csv row data (array or object).


**errors**

 csv-parser errors.


**meta**

 csv-parser meta data



in CommonJs/node context, [babyparse](https://www.npmjs.com/package/babyparse) will be used

for parser config see http://papaparse.com/docs

## AMD support

requires [underscore](underscorejs.org) and [papaparse](http://papaparse.com/) to be [defined](http://requirejs.org/docs/api.html#define) earlier.


## Browser support 

requires [underscore](underscorejs.org) and [papaparse](http://papaparse.com/) loaded before, csv2x expects

```
window._, window.Papa
```

