(function () {
	
	window.KNN = {};
	
	KNN.Item = function (object) {
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				this[key] = object[key];
			}
		}
	};
	
	KNN.Item.prototype.measureDistances = function(centre_interet1_range_obj,centre_interet2_range_obj,centre_interet3_range_obj) {
	
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
	
	KNN.Item.prototype.sortByDistance = function() {
		this.neighbors.sort(function (a, b) {
			return a.distance - b.distance;
		});
	};
	
	KNN.Item.prototype.guessType = function(k) {
	
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

	KNN.ItemList = function (k) {
		this.nodes = [];
		this.k = 1;
	};

	KNN.ItemList.prototype.add = function (node) {
		this.nodes.push(node);
	};
	//normalisation , ramener tous les valeur dans l'intervale 0 1 .
	KNN.ItemList.prototype.calculateRanges = function() {
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

				/*
				if (this.nodes[i].area < this.areas.min) {
					this.areas.min = this.nodes[i].area;
				}

				if (this.nodes[i].area > this.areas.max) {
					this.areas.max = this.nodes[i].area;
				} */
			}
		}

	};
	
	KNN.ItemList.prototype.determineUnknown = function () {

		this.calculateRanges();

		/*
		 * Loop through our nodes and look for unknown types means where the type is equal to false.
		 */
		for (var i in this.nodes) {
		
			if (this.nodes.hasOwnProperty(i)) {
			
				if ( ! this.nodes[i].but_voyage) {
					/*
					 * If the node is an unknown type, clone the nodes list and then measure distances.
					 */
					
					/* Clone nodes */
					this.nodes[i].neighbors = [];
					
					for (var j in this.nodes) {
						if ( ! this.nodes[j].but_voyage)
							continue;
						this.nodes[i].neighbors.push( new KNN.Item(this.nodes[j]) );
					}

					/* Measure distances */
					this.nodes[i].measureDistances(this.centre_interet1, this.centre_interet2,this.centre_interet3);

					/* Sort by distance */
					this.nodes[i].sortByDistance();

					/* Guess type */
					this.but_voyage = this.nodes[i].guessType(this.k);

				}
			}
		}
		/*
		for (var i in this.nodes){

		} */
	};
	KNN.ItemList.prototype.show = function(){
		/*
		for (var i in this.nodes) {
			
			if (this.nodes.hasOwnProperty(i)) {
				console.log(this.area,this.type);
			}
		} */
		console.log(this.but_voyage);
	}
})();
