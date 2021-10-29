String.WHITESPACE = " \t\r\n";
String.prototype.capitalize = function(capitalizeAll){ 
	function _upperCase(s) {return s.toUpperCase();}
	var s = $.trim(this);
	if (capitalizeAll) return s.replace(/^.|\s./g, _upperCase);
	else return s.replace(/(^\w)/, _upperCase);
};
String.prototype.camelize = function(){
	return this.replace (/(?:^|[-_])(\w)/g, function(_, c){
		return c ? c.toUpperCase() : '';
	});
};
String.prototype.toBoolean = function(){
	if(this == undefined)return false;
	var regx = /^(true|1|yes|on)$/i;
	return regx.test(this);
};
String.prototype.formatCurrency = function(symbol, useDecimals, decimalPoint, thousandSeparator, locale){
	if(!$.isNumeric(this))return this.valueOf();
	var ret = (symbol==false||symbol==''?'':'\u20AC ') + this.formatNumber(useDecimals ? 2 : 0, decimalPoint||',', thousandSeparator||'.');
	//if(!useDecimals && (locale || 'nl').toLowerCase()=='nl')ret += ',-';
	return ret;
};
String.prototype.formatNumber = function(decimals, decimalPoint, thousandSeparator){
	if(!$.isNumeric(this))return this.valueOf();
	var a = parseFloat(this).toFixed(decimals||0).split('.');
	a[0] = a[0].replace(/(\d)(?=(\d\d\d)+$)/g, '$1'+(thousandSeparator||'.'));
	return a.join(decimalPoint||',');
};
String.prototype.trimLeft = function(removeChars){
	removeChars = removeChars || String.WHITESPACE;
	return this.replace(new RegExp('^[' + removeChars + ']+', ''), '');
};
String.prototype.trimRight = function(removeChars){
	removeChars = removeChars || String.WHITESPACE;
	return this.replace(new RegExp('[' + removeChars + ']+$', ''), '');
};
String.prototype.trim = function(removeChars){
	removeChars = removeChars || String.WHITESPACE;
	return this.replace(new RegExp('^[' + removeChars + ']+|[' + removeChars + ']+$', 'g'), '');
};
