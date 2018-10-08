var getData = function () { 
	//load the data user json file .
	return $.getJSON("data_users.json"); 
}; 
var add_new_data = function(centre_interet1,centre_interet2,centre_interet3,age){
	//var json = '{"rooms": rooms,"area":area,"type":false}';
	//return JSON.parse(json);
	// JSON.parse('{"rooms": 1,"area":3,"type":false}');
	//json ='{\"rooms\":'+ arguments[0].toString() +',\"area\":'+arguments[1].toString()+',\"type\":false}';
	json ='{\"centre_interet1\":'+ centre_interet1.toString() +',\"centre_interet2\":'+centre_interet2.toString()+',\"centre_interet3\":'+centre_interet3.toString()+',\"age\":'+age.toString()+',\"but_voyage\":false}';
	return JSON.parse(json);
}
var run = function () {
	var homes = new KNN.ItemList();
	var new_data = new KNN.Item(add_new_data(arguments[0],arguments[1],arguments[2],arguments[3]));
	homes.add(new_data);
	$.when(getData().done(function (json) {
		$.each(json.data, function (k,v) {
			homes.add( new KNN.Item(v) );
		});
	}).then(function () {
		homes.determineUnknown();
		homes.show("homes");
	})
);
};
