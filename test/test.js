const assert = require('assert');
const debug = require('debug')('csv2x-test');
const csv2x = require('../csv2x');
const fs = require('fs');

describe('csv2x', function () {


  it('should convert to test output', function (done) {
    
    csv2x(
			{csv: 'A,B,C\nX,Y,Z', template: 'test'},
			(err, html) => {
				debug(this.test.title, err, html);
				assert.strictEqual(
					html, 
					'0: ["A","B","C"]\n1: ["X","Y","Z"]\n'
				);
				done();
			}
		);
  });


  it('should convert to html table rows by default', function (done) {
    
    csv2x(
			{csv: 'A,B,C\nX,Y,Z'},
			(err, html) => {
				debug(this.test.title, err, html);

				assert.strictEqual(
					html, 
					'\n<tr>\n  <td>A</td>\n  <td>B</td>\n  <td>C</td>\n</tr>\n<tr>\n  <td>X</td>\n  <td>Y</td>\n  <td>Z</td>\n</tr>'
				);
				done();
			}
		);
  });


  it('should convert to user defined template output', function (done) {
    
    csv2x(
			{csv: 'A,B,C\nX,Y,Z', template: 'bla bla: <%=JSON.stringify(row)%>\n'},
			(err, html) => {
				debug(this.test.title, err, html);
				assert.strictEqual(
					html, 
					 'bla bla: ["A","B","C"]\nbla bla: ["X","Y","Z"]\n'
				);
				done();
			}
		);
  });


  it('should not process empty rows in predefined html template', function (done) {
    csv2x(
			{csv: ', ,\t', template: 'html'},
			(err, html) => {
				debug(this.test.title, err, html);
				assert.strictEqual(html, '');
				done();
			}
		);
  });


  it('should process rows in predefined html template with numbers 0', function (done) {
    csv2x(
			{csv: ',\t,0', template: 'html'},
			(err, html) => {
				debug(this.test.title, err, html);
				assert.strictEqual(html, '\n<tr>\n  <td></td>\n  <td>\t</td>\n  <td>0</td>\n</tr>');
				done();
			}
		);
  });


  it('should provide optional cell values', function (done) {
    csv2x(
			{
				csv: fs.readFileSync('test/test.csv', 'utf8'), 
				template: fs.readFileSync('test/test-template.html', 'utf8'),
				header: true
			},
			(err, html) => {
				debug(this.test.title, err, html);
				assert.strictEqual(
					167, 
					html.indexOf('<dd>none</dd>'), 
					'should have set "none" as optional value'
				);
				done();
			}
		);
  });

}); // describe

