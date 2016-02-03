//For fyp experiment questions with manipulatable polygon and arrow diagram
//Code adapted from jspsych demos

(function($) {
    jsPsych['rotation'] = (function() {

        var plugin = {};

        plugin.create = function(params) {

            var trials = new Array(1);
            for (var i = 0; i < trials.length; i++) {
		var response_choices = (typeof params.response_choices === 'undefined') ? [70,74] : params.response_choices; //keypresses to accept, default is "f","j"
		var response_mappings =  (typeof params.response_mappings === 'undefined') ? ["correct","incorrect"] : params.response_mappings; //mapping from keypresses to responses
                trials[i] = {
                    "timing_post_trial": (typeof params.timing_post_trial === 'undefined') ? 0 : params.timing_post_trial,
		    "response_choices": response_choices,
		    "response_mappings": response_mappings, 
                    "prompt": (typeof params.prompt === 'undefined') ? 'Press' + response_choices[0] + ' if the figure is ' + response_mappings[0] + ', and press ' + response_choices[1] + ' if the figure is ' + response_mappings[1] +'.': params.prompt,
                    "rotation": (typeof params.rotation === 'undefined') ? 'none' : params.rotation, //Rotation "none", "CW", "CCW"
                    "correct_response": (typeof params.correct_response === 'undefined') ? 'correct' : params.correct_response,
                    "object_order": (typeof params.object_specifier === 'undefined') ? [0,1,2,3] : params.object_specifier,
                    "trial_type": (typeof params.trial_type === 'undefined') ? 'correct' : params.trial_type // Whether trial is "correct", if not, whether "swap" error, or "rotate" error
                };
            }
            return trials;
        };

        plugin.trial = function(display_element, trial) {

	trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	var turkInfo = jsPsych.turk.turkInfo();
	var start_time = (new Date()).getTime();
	var orientation_history = [];
	var response_history = [];

	display_element.append('<div id="question-div"></div>');
	$('#question-div').append($('<canvas>', {
		"id": "experiment-canvas",
		"width": 800,
		"height": 600
	}));
        $('#experiment-canvas')[0].width = 800;
        $('#experiment-canvas')[0].height = 600;


	$('#question-div').append('<br /><br />'+trial.prompt);

	var canvas = $("#experiment-canvas")[0];
	var context = canvas.getContext('2d');
	var centerX = canvas.width / 2;
	var centerY = canvas.height / 2;


	//Display the cue image
	var display_cue = function(rotation_speed) {
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
				//Next phase
				display_pre_object(trial.object_specifier);
			}
		}
		window.setTimeout(function() {animate_pinwheel((new Date()).getTime(),rotation_speed,cue_time)},33)
	}
	//Display object before rotation/wait/etc.
	var display_pre_object = function(object_specifier) {
		var pre_time = 500; //ms
		var colors = ["rgb(233,122,0)","rgb(0,166,0)","rgb(0,136,233)","rgb(230,0,230)"];
		
			
	}
	//Display object after rotation/wait/etc.
	var display_post_object = function() {

	}	

	var end_function = function(info) {
		var end_time = (new Date()).getTime();
		var rt = end_time - start_time;

		var this_response = info.key; 
		
		jsPsych.data.write({
			"question": trial.prompt,
			"response_type": trial.response_type,
			"response_choices": (trial.response_type == 'free') ? [] : trial.response_choices,
			"correct_response": trial.correct_response,
			"response": this_response,
			"rt": rt
		});

                jsPsych.pluginAPI.cancelAllKeyboardResponses();

		// advance to next part
		display_element.html("");
		jsPsych.finishTrial();
//			jsPsych.data.displayData('json');
	};

        var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: end_function,
                valid_responses: trial.response_choices,
                rt_method: 'date',
                persist: true,
                allow_held_key: false
        }); 

	//Show cue
	display_cue(0.001);

	};
        return plugin;
    })();
})(jQuery);
