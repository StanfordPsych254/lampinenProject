//For fyp experiment questions with manipulatable polygon and arrow diagram
//Code adapted from jspsych demos

(function($) {
    jsPsych['rotation'] = (function() {

        var plugin = {};

	var audio_context = new AudioContext();
	var sounds = ['./audio/incorrect.mp3','./audio/rotation_sound.mp3'];
	incorrect_sound = jsPsych.pluginAPI.loadAudioFile(sounds[0]);
	rotation_sound = jsPsych.pluginAPI.loadAudioFile(sounds[1]);

	rotate_array = function(array, n ) {
	  array.unshift.apply( array, array.splice( n, array.length ) )
	  return array;
	}

	function cyclically_permuted(a,b) {
		var return_val = false
		for (i=0; i < a.length;i++) {
			if (JSON.stringify(rotate_array(b,1)) == JSON.stringify(a)) {
				return_val = true;
				break;
			}
		}
		return return_val
	}


	function select_new_object_specifier(old_obj_spec) {
		var new_obj_spec = [-1,-1,-1,-1].map(function() {return old_obj_spec.splice(Math.floor(Math.random()*old_obj_spec.length),1);  })
		while (cyclically_permuted(new_obj_spec, old_obj_spec)) {
			new_obj_spec = [-1,-1,-1,-1].map(function() {return old_obj_spec.splice(Math.floor(Math.random()*old_obj_spec.length),1);  })
		}
		return new_obj_spec
	}

        plugin.create = function(params) {

            var trials = new Array(1);
            for (var i = 0; i < trials.length; i++) {
		var response_choices = (typeof params.response_choices === 'undefined') ? [69,73] : params.response_choices; //keypresses to accept, default is "e","i"
		var response_mappings =  (typeof params.response_mappings === 'undefined') ? ["correct","incorrect"] : params.response_mappings; //mapping from keypresses to responses
		var trial_type = (typeof params.trial_type === 'undefined') ? 'correct' : params.trial_type; // Whether trial is "correct", if not, whether "swap" error, or "rotate" error
		var object_specifier = (typeof params.object_specifier === 'undefined') ? [0,1,2,3] : params.object_specifier;
                trials[i] = {
                    "timing_post_trial": (typeof params.timing_post_trial === 'undefined') ? 0 : params.timing_post_trial,
		    "response_choices": response_choices,
		    "response_mappings": response_mappings, 
                    "prompt": (typeof params.prompt === 'undefined') ? 'Press ' + String.fromCharCode(response_choices[0]) + ' if the figure is ' + response_mappings[0] + ', and press ' + String.fromCharCode(response_choices[1]) + ' if the figure is ' + response_mappings[1] +'.': params.prompt,
                    "rotation_speed": (typeof params.rotation_speed === 'undefined') ? 0 : params.rotation_speed, //Rotation 0 for none, clockwise: positive, counter-clockwise: negative, radians/ms
                    "rotation_time": (typeof params.rotation_time === 'undefined') ? 800 : params.rotation_time, //Rotation time, 800, 1600, or 2400, ms
                    "object_specifier": object_specifier, 
                    "final_object_specifier": (trial_type === 'swap') ? select_new_object_specifier(object_specifier.slice(0)) : object_specifier,
                    "initial_angle": (typeof params.initial_angle === 'undefined') ? 0 : params.initial_angle, //Initial angle of object, in radians.
                    "verb_supp_check": (typeof params.verb_supp_check === 'undefined') ? false: params.verb_supp_check, //Whether to test recall of consonants on this trial
                    "trial_type": trial_type, 
                    "correct_response": (trial_type === 'correct') ? 'correct' : 'incorrect'
                };
            }
            return trials;
        };

        plugin.trial = function(display_element, trial) {

	trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	var turkInfo = jsPsych.turk.turkInfo();
	var start_time = (new Date()).getTime();
	//Trial variables



	//State variables////////
	var trial_response_phase = false; //Set to true while awaiting response
	var verb_supp_checking = false; //set to true while testing consonant memory for verbal suppression
	/////////////////////////

	var consonant_list = ["b", "c", "d", "f", "g", "h",  "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"] 
		
	var these_consonants = ["","","",""].map(function() {return consonant_list.splice(Math.floor(Math.random()*consonant_list.length),1);  })
		
		

	display_element.append('<div id="question-div"></div>');
	$('#question-div').append($('<canvas>', {
		"id": "experiment-canvas",
		"width": 800,
		"height": 600
	}));
        $('#experiment-canvas')[0].width = 800;
        $('#experiment-canvas')[0].height = 600;


	$('#question-div').append('<br /><br />');
	$('#question-div').append($('<div>', {
		"id": "prompt-div",
		"text": ""
	}));
	var canvas = $("#experiment-canvas")[0];
	var context = canvas.getContext('2d');
	var centerX = canvas.width / 2;
	var centerY = canvas.height / 2;

	//Present consonants for verbal suppression task
	var display_consonants = function(these_consonants) {
		var consonant_present_time = 2000; //ms
		context.clearRect(0,0,canvas.width,canvas.height);
		context.font = "50px Arial";
		context.textAlign = "center";
		context.fillText(these_consonants.join(''),centerX,centerY);
		window.setTimeout(function(){display_cue(trial.rotation_speed)} ,consonant_present_time);
		$('#prompt-div').text('Rehearse these consonants during the task');
	}
	//Display the cue image
	var display_cue = function(rotation_speed) {
		$('#prompt-div').text('');
		var cue_time = 2400; //ms
		var draw_pinwheel = function(angle) {
			context.clearRect(0,0,canvas.width,canvas.height);
			var pi = Math.PI;
			var radius = 263;
			var draw_pie_slice = function(angle,fill) {
				context.beginPath();
				context.arc(centerX, centerY, radius, angle, angle+ 0.167 *pi);
				context.lineTo(centerX,centerY);
				context.closePath()
				context.fillStyle = fill;
				context.fill();
			}
			draw_pie_slice(angle,'black');
			draw_pie_slice(angle+0.333*pi,'white');
			draw_pie_slice(angle+0.667*pi,'black');
			draw_pie_slice(angle+pi,'white');
			draw_pie_slice(angle+1.333*pi,'black');
			draw_pie_slice(angle+1.667*pi,'white');
			//Outer circle
			context.beginPath();
			context.arc(centerX, centerY, radius, 0, 0+ 2*pi);
			context.lineWidth = 2;
			context.strokeStyle = "black";
			context.stroke();
			
		}
		draw_pinwheel(0);

		var source = null; //Audio source
		//Positive rotation speeds go CW, negative CCW
		var animate_pinwheel = function(startTime,rotation_speed,cue_time) {
			var frame_length = 33; //ms, i.e. 30 fps
			var time = (new Date()).getTime() - startTime;
			var angle = rotation_speed*time;
			if (time < cue_time) {
				draw_pinwheel(angle);
				window.setTimeout(function() { animate_pinwheel(startTime,rotation_speed,cue_time) },frame_length);
			}
			else {
				context.clearRect(0,0,canvas.width,canvas.height);
				//stop audio
				if (trial.rotation_speed != 0 && source) {
					source.stop();
				}
				//Next phase
				display_pre_object(trial.object_specifier,trial.rotation_time);
			}
		}
		// play rotation sound:
		if (trial.rotation_speed != 0) {
			try {
				source = audio_context.createBufferSource();
				source.buffer = jsPsych.pluginAPI.getAudioBuffer(rotation_sound);
				source.connect(audio_context.destination);
				startTime = audio_context.currentTime + 0.1;
				source.start(startTime);
			}
			catch (err) {
				console.log("Rotation sound failed to load");
				source = null;
			}
		}
		window.setTimeout(function() {animate_pinwheel((new Date()).getTime(),rotation_speed,cue_time)},33)
	}

	//Functions & variables for displaying object
	var display_object = function(object_specifier,angle) {
		var colors = ["rgb(233,122,0)","rgb(0,166,0)","rgb(0,136,233)","rgb(230,0,230)"];
		var rect_length = 263;
		var rect_width = 60;
		var rect_half_width = rect_width/2;
		var halfpi = 0.5*Math.PI
		context.clearRect(0,0,canvas.width,canvas.height);
		context.translate(centerX,centerY)
		context.rotate(angle)
		context.translate(-centerX,-centerY)
		for (i = 0; i < object_specifier.length; i++) {
			context.translate(centerX,centerY)
			context.rotate(i*halfpi)
			context.translate(-centerX,-centerY)
			context.beginPath()
			context.rect(centerX+rect_half_width,centerY-rect_half_width,rect_length,rect_width)
			context.fillStyle = colors[object_specifier[i]]
			context.fill();
			context.translate(centerX,centerY)
			context.rotate(-i*halfpi)
			context.translate(-centerX,-centerY)
			
		}
		context.translate(centerX,centerY)
		context.rotate(-angle)
		context.translate(-centerX,-centerY)
		//draw center circle
		context.beginPath()
		context.arc(centerX, centerY, 1.414*rect_half_width, 0, 4*halfpi);//1.414 = sqrt(2)
		context.fillStyle = "black";
		context.fill();
	}
	
	//Display object before rotation/wait/etc.
	var display_pre_object = function(object_specifier,rotation_time) {
		var pre_time = 500; //ms
		display_object(object_specifier,trial.initial_angle);

		var rotation_time = trial.rotation_time; //ms
		
		window.setTimeout(function() {
			context.clearRect(0,0,canvas.width,canvas.height); 
			// play rotation sound:
			var source = null;
			if (trial.rotation_speed != 0) {
				try {
					source = audio_context.createBufferSource();
					source.buffer = jsPsych.pluginAPI.getAudioBuffer(rotation_sound);
					source.connect(audio_context.destination);
					startTime = audio_context.currentTime + 0.1;
					source.start(startTime);
				}
				catch (err) {
					console.log("Rotation sound failed to load");
					source = null;
				}
			}
			window.setTimeout(function() {
				if (trial.rotation_speed != 0 && source) {
					source.stop();
				}
				display_post_object(object_specifier);
			},rotation_time)
		},pre_time)
		
		
			
	}
	//Display object after rotation/wait/etc.
	var rt_start_time;
	var rt;
	var final_angle;
	var display_post_object = function(object_specifier) {
		rt_start_time = (new Date()).getTime();
		
		$('#prompt-div').text(trial.prompt);
		if (trial.trial_type == "rotate") { //If rotation error
			var rotation_times = [800,1600,2400];
			rotation_times.splice(rotation_times.indexOf(trial.rotation_time),1);	
			var r = Math.floor(2*Math.random()); //Select a random rotation time from the other two options
			final_angle = trial.initial_angle + trial.rotation_speed*rotation_times[r]; 
		}
		else {
			final_angle = trial.initial_angle+trial.rotation_speed*trial.rotation_time;
		}
		display_object(trial.final_object_specifier,final_angle);
		trial_response_phase = true;
	}	

	var consonant_correct_count = 0
	var consonant_check = function(info) { //Called after keypress when checking verbal suppresion, sees if pressed key matches next consonant
		if (info.key < 65 || info.key > 90) {
			return
		}
		if ((String.fromCharCode(info.key)).toLowerCase() == these_consonants[consonant_correct_count]) {
			consonant_correct_count++;
			//console.log(consonant_correct_count)
			if (consonant_correct_count == 4) {
				verb_supp_checking = false;
				end_function();
			}
		}
		else {
			verb_supp_checking = false;
			// play buzzer
			try {
				var source = audio_context.createBufferSource();
				source.buffer = jsPsych.pluginAPI.getAudioBuffer(incorrect_sound);
				source.connect(audio_context.destination);
				startTime = audio_context.currentTime + 0.1;
				source.start(startTime);
			}
			catch (err) {
				//If audio doesn't work, resort to manual feedback
				window.alert("Sorry, that consonant was incorrect.");
			}
			var verb_supp_wrong_delay_time = 3000;//ms
			window.setTimeout(function(){end_function()} ,verb_supp_wrong_delay_time);
		}

	}
	
	var this_response = -1;
	var trial_response = function(info) {
		if (!trial_response_phase) {
			return
		}
		var rt_end_time = (new Date()).getTime();
		rt = rt_end_time - rt_start_time;
		trial_response_phase = false; //Response received
		this_response = info.key; 
		response_index = trial.response_choices.indexOf(this_response);
		if (trial.response_mappings[response_index] == trial.correct_response) {

		}
		else {
			// play buzzer
			try {
				var source = audio_context.createBufferSource();
				source.buffer = jsPsych.pluginAPI.getAudioBuffer(incorrect_sound);
				source.connect(audio_context.destination);
				startTime = audio_context.currentTime + 0.1;
				source.start(startTime);
			}
			catch (err) {
				//If audio doesn't work, resort to manual feedback
				window.alert("Sorry, the final image was " + trial.correct_response);
			}
		}

		if (trial.verb_supp_check) {
			verb_supp_checking = true;
			context.clearRect(0,0,canvas.width,canvas.height);
			$('#prompt-div').text("Please type the consonants that you were shown at the beginning of the trial");
			return
		} 
		end_function()
		
	}
	var end_function = function() {
		var end_time = (new Date()).getTime();
		var trial_time = end_time - start_time;

		
		jsPsych.data.write({
			"prompt": trial.prompt,
			"response_type": trial.response_type,
			"correct_response": trial.correct_response,
			"response": this_response,
			"trial_time": trial_time, //Total time the trial took
			"rt": trial_time, //Reaction time, from post-rotation stimulus presentation until a response key was pressed
			"response_choices": trial.response_choices,
			"response_mappings": trial.response_mappings, 
			"rotation_speed": trial.rotation_speed, 
			"rotation_time": trial.rotation_time,
			"object_specifier": trial.object_specifier, 
			"initial_angle": trial.initial_angle,
			"final_object_specifier": trial.final_object_specifier, 
			"final_angle": final_angle, 
			"verb_supp_check": trial.verb_supp_check, 
			"consonant_correct_count": consonant_correct_count, 
			"verb_supp_consonants": these_consonants,
			"trial_type": trial.trial_type, 
			"correct_response": trial.correct_response 
		});

                jsPsych.pluginAPI.cancelAllKeyboardResponses();

		// advance to next part
		display_element.html("");
		jsPsych.finishTrial();
//			jsPsych.data.displayData('json');
	};

        var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: function(info) {

			if (info.key == trial.response_choices[0] || info.key == trial.response_choices[1]) {
				trial_response(info);
			} else if (verb_supp_checking) {
				consonant_check(info);
			}

},
                valid_responses: [],
                rt_method: 'date',
                persist: true,
                allow_held_key: false
        }); 

	//Start experiment
	display_consonants(these_consonants);
	};
        return plugin;
    })();
})(jQuery);
