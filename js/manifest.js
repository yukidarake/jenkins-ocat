var Manifest = function() {};

Manifest.load = function() {
	var result = {};
	$.ajax({
		type : "GET",
		url : chrome.extension.getURL('manifest.json'),
		data : {},
		dataType : "json",
		async : false,
		success : function(json) {
		  result = json;
		}
	});
	return result;
};
