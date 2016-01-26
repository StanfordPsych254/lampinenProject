#Paper/experiment choice: 

*Capacity for Visual Features in Mental Rotation*, Xu & Franceroni, *Psych Science*, *OnlineFirst* 2015


#Justification

This paper evaluates an interesting phenomenon with possible relevance to some symmetry group research I am considering.

#Stimuli/Procedures

The stimuli require some simple animation, rotating pinwheels and crosses, but they will not be too difficult to implement using javascript and HTML canvas elements.

The procedures will follow the original experiment. The subjects will receive a set of training trials, and then a set of practice trials, followed by the experiment. The training will have to be slightly adapted to have programmatic rather than experimenter feedback, but otherwise it should proceed as in the original experiment. On a trial, the subjects will be presented with (rotation trial differences from control trial in parentheses):

0. A set of 4 consonants to rehearse & remember during the trial.
1. A cue of a (rotating) pinwheel for 2,400 ms (with rotation sound).
2. The image of a cross.
3. A blank screen (with rotation sound).
4. The (rotated) cross, possibly with its color order permuted (or with an incorrect rotation). 
5. On 25% of the trials:
..1. Test memory of the consonants.
..2. If memory incorrect, provide auditory feedback, and 3s delay.

