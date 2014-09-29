(function(){
	Array.prototype.circleOffset = function(n){
		var ret = [];
		var l = this.length;
		while(n < 0){
			n += l;
		}

		for(var i=0; i<l; i++){
			var index = (i + n) % l;
			ret.push(this[index]);
		}

		return ret;	
	}
})();

Music = (function(){
	var ret = {};

	var notes = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392, 415.3, 440, 466.16, 493.88];
	var majorSteps = [2,2,1,2,2,2,1];
	var diminishedSteps = [2,1,2,1,2,1,2,1];
	var modes = ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"];
	var chromatic = ["C", "C-SHARP", "D", "D-SHARP", "E", "F", "F-SHARP", "G", "G-SHARP", "A", "A-SHARP", "B"];
	var chromaticFlat = ["C", "D-FLAT", "D", "E-FLAT", "E", "F", "G-FLAT", "G", "A-FLAT", "A", "B-FLAT", "B"];

	function getScale(key, mode, octave){
		key = filterKey(key || "C");
		mode = filterMode(mode || "ionian");
		octave = octave || 4;

		var modeSteps = majorSteps.circleOffset(modes.indexOf(mode));
		var chromaticScale = key.match(/-FLAT/) ? chromaticFlat : chromatic;

		if(mode === "diminished"){
			modeSteps = diminishedSteps;
		}

		var firstNote = chromaticScale.indexOf(key);
		var ret = [];

		var stepsFromFirstNote = 0;
		for(var i=0; i<(modeSteps.length + 1); i++){
			if(i){
				stepsFromFirstNote += modeSteps[i - 1];
			}

			var noteIndex = (firstNote + stepsFromFirstNote) % chromaticScale.length;
			var octaveOffset = Math.floor((firstNote + stepsFromFirstNote) / chromaticScale.length);

			while(noteIndex < 0){
				noteIndex += chromaticScale.length;
			}

			var note = (octave + octaveOffset) + "_" + chromaticScale[noteIndex];
			ret.push(note);
		}

		return ret;
	}

	function filterKey(key){
		var ret = key;

		if(ret === "C-FLAT"){
			ret = "B";
		}
		if(ret === "B-SHARP"){
			ret = "C";
		}
		if(ret === "E-SHARP"){
			ret = "F";
		}
		if(ret === "F-FLAT"){
			ret = "E";
		}

		return ret;
	}

	function filterMode(mode){
		ret = mode;

		if(ret === "major"){
			ret = "ionian";
		}
		if(ret === "minor"){
			ret = "aeolian";
		}

		return ret;
	}

	function getNoteFrequency(note){
		var octave = note.split("_").shift();
		var chromaticScale = note.match(/-FLAT/) ? chromaticFlat : chromatic;
		var chromaticIndex = chromaticScale.indexOf(note.split("_").pop());
		var middleFrequency = notes[chromaticIndex];
		var multiplier = Math.pow(2, octave - 4);

		return middleFrequency * multiplier;
	}


	ret.getScale = getScale;
	ret.getNoteFrequency = getNoteFrequency;

	return ret;
})();

