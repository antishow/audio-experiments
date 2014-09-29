var audiolet = new Audiolet();

(function(){
	app = angular.module("audio", []);
	activeKeys = [];
	toneGenerators = [];

	app.filter("noteDisplay", function(){
		return function(input){
			return input.replace(/^\d+_/, "")
				.replace(/-SHARP/g, "\u266f")
				.replace(/-FLAT/g, "\u266d");
		}
	});

	app.controller("synth", function($scope){
		$scope.title = "Digital Harmonica";

		$scope.note = "C";
		$scope.accidental = "";
		$scope.mode = "major";
		$scope.octave = 4;
		$scope.waveform = "Sine";

		$scope.notes = [
			{ label: "C", value: "C" },
			{ label: "D", value: "D" },
			{ label: "E", value: "E" },
			{ label: "F", value: "F" },
			{ label: "G", value: "G" },
			{ label: "A", value: "A" },
			{ label: "B", value: "B" }
		];
		$scope.accidentals = [
			{ label: "\u266e", value: "" },
			{ label: "\u266d", value: "-FLAT" },
			{ label: "\u266f", value: "-SHARP" }
		];
		$scope.modes = [
			{ label: "Major", value: "major" },
			{ label: "Minor", value: "minor" },
			{ label: "Diminished", value: "diminished" },
			{ label: "Dorian", value: "dorian" },
			{ label: "Phyrigian", value: "phrygian" },
			{ label: "Lydian", value: "lydian" },
			{ label: "Mixolydian", value: "mixolydian" },
			{ label: "Locrian", value: "locrian" }
		];
		$scope.octaves = [1, 2, 3, 4, 5, 6, 7];
		$scope.waveforms = ["Sine", "Saw", "Square", "Triangle"];

		$scope.updateScale = function(){
			$scope.scale = Music.getScale($scope.note + $scope.accidental, $scope.mode, $scope.octave);
			for(var i=0; i<$scope.scale.length; i++){
				var note = $scope.scale[i];
				if(window.toneGenerators[i]){
					window.toneGenerators[i].remove();
				}

				window.toneGenerators[i] = new (window[$scope.waveform])(audiolet, Music.getNoteFrequency(note));
			}
		};

		$scope.updateScale();

		window.synth = $scope;

	$(document).on("keydown", onKeyDown);
	$(document).on("keyup", onKeyUp);
	$(document).on("mousedown touchstart", ".key", onMouseDown);
	$(document).on("mouseup touchend", ".key", onMouseUp);

	function activateKey(n){
		var key = $(".keys .key").get(n);
		if(!activeKeys[n]){
			activeKeys[n] = true;
			$(key).addClass("active");
			updateTone();
		}
	}

	function deactivateKey(n){
		var key = $(".keys .key").get(n);
		if(activeKeys[n]){
			activeKeys[n] = false;
			$(key).removeClass("active");
			updateTone();
		}
	}

	function onMouseDown(e){
		var el = $(e.currentTarget);
		activateKey(el.index());
	}

	function onMouseUp(e){
		var el = $(e.currentTarget);
		deactivateKey(el.index());
	}

	function onKeyDown(e){
		if(e.keyCode >= 49 && e.keyCode <= 57){
			var activeKeyIndex = e.keyCode - 49;
			activateKey(activeKeyIndex);
		}
	}

	function onKeyUp(e){
		if(e.keyCode >= 49 && e.keyCode <= 57){
			var activeKeyIndex = e.keyCode - 49;
			deactivateKey(activeKeyIndex);
		}
	}

	updateTone = function(){
		for(var i=0; i<synth.scale.length; i++){
			toneGenerators[i].remove();

			if(activeKeys[i]){
				toneGenerators[i].connect(audiolet.output);
			}
		}
	}
	});
})();