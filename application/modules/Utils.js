/**
 * Assert that the input is numeric
 */
module.exports.isNumeric = function(data) {
	return (typeof data === 'number' && data%1 == 0);
}