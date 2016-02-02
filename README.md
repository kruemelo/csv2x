# csv2x

## command line usage

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

with input file:
```
$ node csv2x --if=./node_modules/papaparse/tests/long-sample.csv
```

with template option to use a predefined template:
```
$ node csv2x --if=./node_modules/papaparse/tests/long-sample.csv --template=test
```

with header option to handle the first csv row as field names:
```
$ node csv2x --if=./node_modules/papaparse/tests/long-sample.csv --template=test
```

with debug option:
```
$ DEBUG=csv2x node csv2x --if=./node_modules/papaparse/tests/long-sample.csv
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

## available template values

```
{
  rowIndex: int current csv row index,
  argv: option hash set in csv2x(), minimist argv when running from cli,
  parser: csv-parser (papaparse/babyparse) instance,
  row: the current csv row data,
  errors: csv-parser errors,
  meta: csv-parser meta data
}
```

in CommonJs/node context, [babyparse](https://www.npmjs.com/package/babyparse) will be used

for parser config see http://papaparse.com/docs

## AMD support

requires [underscore](underscorejs.org) and [papaparse](http://papaparse.com/) to be [defined](http://requirejs.org/docs/api.html#define) earlier.


## Browser support 

requires [underscore](underscorejs.org) and [papaparse](http://papaparse.com/) loaded before, csv2x expects

```
window._, window.Papa
```

