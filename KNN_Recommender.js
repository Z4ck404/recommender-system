(function () {
	Item = function (object) {
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				this[key] = object[key];
			}
		}
	};	
	Item.prototype.measureDistances = function(centre_interet1_range_obj,centre_interet2_range_obj,centre_interet3_range_obj) {
		var centre_interet1_range = centre_interet1_range_obj.max - centre_interet1_range_obj.min;
		var centre_interet2_range = centre_interet2_range_obj.max - centre_interet2_range_obj.min;
		var centre_interet3_range = centre_interet3_range_obj.max - centre_interet3_range_obj.min;
		//var age_range  = age_range_obj.max - age_range_obj.min;
		for (var i in this.neighbors) {
			if (this.neighbors.hasOwnProperty(i)) {
				var neighbor = this.neighbors[i];
				var delta_centre_interet1 = neighbor.centre_interet1 - this.centre_interet1;
				delta_centre_interet1 = (delta_centre_interet1) / centre_interet1_range;
				var delta_centre_interet2 = neighbor.centre_interet2 - this.centre_interet2;
				delta_centre_interet2 = (delta_centre_interet2) / centre_interet2_range;
				var delta_centre_interet3 = neighbor.centre_interet3 - this.centre_interet3;
				delta_centre_interet3 = (delta_centre_interet3) / centre_interet3_range;
				//var delta_age  = neighbor.age  - this.age;
				//delta_age = (delta_age) / age_range;
				neighbor.distance = Math.sqrt( delta_centre_interet1*delta_centre_interet1 + delta_centre_interet2*delta_centre_interet2+delta_centre_interet3*delta_centre_interet3 );
			}
		}
	};
	Item.prototype.sortByDistance = function() {
		this.neighbors.sort(function (a, b) {
			return a.distance - b.distance;
		});
	};
	Item.prototype.guessType = function(k) {
		var types = {};
		for (var i in this.neighbors.slice(0, k)) {
			var neighbor = this.neighbors[i];
			if ( ! types[neighbor.but_voyage] ) {
				types[neighbor.but_voyage] = 0;
			}
			types[neighbor.but_voyage] += 1;
		}
		var guess = {but_voyage: false, count: 0};
		for (var but_voyage in types) {
			if (types[but_voyage] > guess.count) {
				guess.but_voyage = but_voyage;
				guess.count = types[but_voyage];
			}
		}
		this.guess = guess;
		return types;
	};
	ItemList = function (k) {
		this.nodes = [];
		this.k = 1;
	};
	ItemList.prototype.add = function (node) {
		this.nodes.push(node);
	};
	//normalisation , ramener tous les valeur dans l'intervale 0 1 .
	ItemList.prototype.calculateRanges = function() {
		this.centre_interet1 = {min: 1000000, max: 0};
		this.centre_interet2 = {min: 1000000, max: 0};
		this.centre_interet3 = {min: 1000000, max: 0};
		this.age = {min: 1000000, max: 0};
		for (var i in this.nodes) {
			if (this.nodes.hasOwnProperty(i)) {
				if (this.nodes[i].centre_interet1 < this.centre_interet1.min) {
					this.centre_interet1.min = this.nodes[i].centre_interet1;
				}
				if (this.nodes[i].centre_interet1 > this.centre_interet1.max) {
					this.centre_interet1.max = this.nodes[i].centre_interet1;
				}
				if (this.nodes[i].centre_interet2 < this.centre_interet2.min) {
					this.centre_interet2.min = this.nodes[i].centre_interet2;
				}
				if (this.nodes[i].centre_interet2 > this.centre_interet2.max) {
					this.centre_interet2.max = this.nodes[i].centre_interet2;
				}
				if (this.nodes[i].centre_interet3 < this.centre_interet3.min) {
					this.centre_interet3.min = this.nodes[i].centre_interet3;
				}
				if (this.nodes[i].centre_interet3 > this.centre_interet3.max) {
					this.centre_interet3.max = this.nodes[i].centre_interet3;
				}if (this.nodes[i].age < this.age.min) {
					this.age.min = this.nodes[i].age;
				}
				if (this.nodes[i].age > this.age.max) {
					this.age.max = this.nodes[i].age;
				}
			}
		}

	};
	ItemList.prototype.determineUnknown = function () {
		this.calculateRanges();
		for (var i in this.nodes) {
			if (this.nodes.hasOwnProperty(i)) {
				if ( ! this.nodes[i].but_voyage) {
					this.nodes[i].neighbors = [];
					for (var j in this.nodes) {
						if ( ! this.nodes[j].but_voyage)
							continue;
						this.nodes[i].neighbors.push( new Item(this.nodes[j]) );
					}
					/* Measure distances */
					this.nodes[i].measureDistances(this.centre_interet1, this.centre_interet2,this.centre_interet3);
					/* Sort by distance */
					this.nodes[i].sortByDistance();
					/* Guess type */
					this.but_voyage = this.nodes[i].guessType(this.k);
					
					console.log(Object.keys(this.but_voyage)[0]);
				}
			}
		}
	};
	ItemList.prototype.show = function(){	
		for (var i in this.nodes) {
			return  JSON.stringify(this.type);
	}}
})();
var c1 = process.argv[2];
var c2 = process.argv[3];
var c3 = process.argv[4];
var add_new_data = function(centre_interet1,centre_interet2,centre_interet3,age){
	centre_interet1 = ""+centre_interet1;
	centre_interet2 = ""+centre_interet2;
	centre_interet3 = ""+centre_interet3;
	age = ""+age;
	json ='{\"centre_interet1\":'+ centre_interet1+',\"centre_interet2\":'+centre_interet2+',\"centre_interet3\":'+centre_interet3+',\"but_voyage\":false}';
	return JSON.parse(json);
} 
var getData = function () { 
	var json_data = require('./data_users.json');
    var dat = json_data.data;
	return dat 
};
var run = function () {
	var homes = new ItemList();
	var new_data = new Item(add_new_data(c1,c2,c3));
	homes.add(new_data);
	data = getData();
	Object.keys(data).forEach(function(i){
		homes.add(new Item(data[i]));
	});
	homes.determineUnknown();
	homes.show("homes");
};
run();
