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
	var naturals = ["C", "D", "E", "F", "G", "A", "B"];
	var modes = ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"];
	var chromatic = [
		"B-SHARP/C/D-FLAT-FLAT", 
		"B-SHARP-SHARP/C-SHARP/D-FLAT", 
		"C-SHARP-SHARP/D/E-FLAT-FLAT", 
		"D-SHARP/E-FLAT/F-FLAT-FLAT", 
		"D-SHARP-SHARP/E/F-FLAT", 
		"E-SHARP/F/G-FLAT-FLAT", 
		"E-SHARP-SHARP/F-SHARP/G-FLAT", 
		"F-SHARP-SHARP/G/A-FLAT-FLAT", 
		"G-SHARP/A-FLAT", 
		"G-SHARP-SHARP/A/B-FLAT-FLAT", 
		"A-SHARP/B-FLAT/C-FLAT-FLAT", 
		"A-SHARP-SHARP/B/C-FLAT"
	];

	function getScale(key, mode, octave){
		key = filterKey(key || "C");
		mode = filterMode(mode || "ionian");
		octave = octave || 4;

		var ret = [];
		var modeSteps = majorSteps.circleOffset(modes.indexOf(mode));
		if(mode === "diminished"){
			modeSteps = diminishedSteps;
		}

		//var firstNote; = chromaticScale.indexOf(key);
		for(var firstNote = 0; firstNote < chromatic.length; firstNote++){
			var chromaticNote = chromatic[firstNote];
			var split = chromaticNote.split("/");
			if(split.indexOf(key) >= 0){
				break;
			}
			else{
				continue;
			}
		}

		var firstNatural = naturals.indexOf(key.split('-').shift());
		var stepsFromFirstNote = 0;

		for(var i=0; i<(modeSteps.length + 1); i++){
			if(i){
				stepsFromFirstNote += modeSteps[i - 1];
			}

			var natural = naturals[(firstNatural + i) % 7];
			var noteIndex = (firstNote + stepsFromFirstNote) % chromatic.length;
			var octaveOffset = Math.floor((firstNote + stepsFromFirstNote) / chromatic.length);

			while(noteIndex < 0){
				noteIndex += chromaticScale.length;
			}

			var noteGroup = (chromatic[noteIndex]).split("/");
			for(var groupIndex = 0; groupIndex<noteGroup.length; groupIndex++){
				var groupItem = noteGroup[groupIndex];
				if(groupItem.substring(0,1) === natural){
					break;
				}
				else{
					continue;
				}
			}
			var note = (octave + octaveOffset) + "_" + noteGroup[groupIndex];

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
		var scaleNote = note.split("_").pop();

		for(var chromaticIndex=0; chromaticIndex<chromatic.length; chromaticIndex++){
			var chromaticNote = chromatic[chromaticIndex];
			var split = chromaticNote.split("/");
			if(split.indexOf(scaleNote) >= 0){
				break;
			}
			else{
				continue;
			}
		}
		var middleFrequency = notes[chromaticIndex];
		var multiplier = Math.pow(2, octave - 4);

		return middleFrequency * multiplier;
	}


	ret.getScale = getScale;
	ret.getNoteFrequency = getNoteFrequency;

	return ret;
})();

