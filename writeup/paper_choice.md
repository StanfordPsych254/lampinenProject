#Tentative choice: 

*Capacity for Visual Features in Mental Rotation*, Y. Xu and S. L. Franconeri, *Psych Science*, Vol. 26(8), 2015
Experiment 1(a) or 1(a & c) or 1(a-c) -- need to discuss what is feasible in terms of implementation and subject compensation

#Justification

Of the math related papers in the 2015 issue of Psych. Science, this seemed the most relevant to my interests, in particular it seems that it has some slight potential to tie in with some symmetry group work I am interested in doing. In addition, it seemed like the only paper with any relation to math that would be achievable online, most the others involved aspects like interviewing both parents and children that would be difficult in an environment like mTurk.  

#Stimuli/Procedures

The experiment will require presentations of consonants, blank screens, rotating pinwheels, and crosses with four bars of different colors, which can be displayed in any order, and rotated. I think these will be relatively easily achieved within an HTML5 canvas object. In addition, the experiment will require a "mechanical sound mimicking a wheel rotating," and auditory feedback, which should be relatively easy to play as well. 

The procedures will follow the original experiment. The subjects will receive a set of training trials, and then a set of practice trials, followed by the experiment. The training will have to be slightly adapted to have programmatic rather than experimenter feedback, but otherwise it should proceed as in the original experiment. On a trial, the subjects will be presented with (rotation trial differences from control trial in parentheses):
0. A set of 4 consonants to rehearse & remember during the trial.
1. A cue of a (rotating) pinwheel for 2,400 ms (with rotation sound).
2. The image of a cross.
3. A blank screen (with rotation sound).
4. The (rotated) cross, possibly with its color order permuted (or with an incorrect rotation). 
5. On 25% of the trials:
..1. Test memory of the consonants.
..2. If memory incorrect, provide auditory feedback, and 3s delay.

