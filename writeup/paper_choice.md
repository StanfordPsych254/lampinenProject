#Paper/experiment choice: 

*Individual Differences in Nonsymbolic Ratio Processing Predict Symbolic Math Performance*, P. G. Mattherws, M. R. Lewis & E. M. Hubbard, *Psych Science*, *OnlineFirst* 2015

Non-symbolic ratio comparison, and symbolic-fraction comparison sections, along with the ANS control tasks.

#Justification

One of my main research interests in mathematical cognition is the development of expertise in symbolic mathematics, so this paper is very relevant. 

#Stimuli/Procedures

The stimuli required would be various presentations of pairs of dot-covered boxes, pairs of lines, and pairs of fractions. They would be relatively easy to generate algorithmically, although some care must then be taken to present the same stimuli to each participant, as the authors did. (E.g. javascript has an implementation dependent RNG, so we cannot simply seed it with a fixed value and expect the same output in each case. We can either use another RNG which does not have this problem, or we can pre-generate the stimuli and save them as images.) Our stimuli would follow the counterbalancing in the paper, of correct answer position, total magnitude or area of the correct answer, etc. 

<<<<<<< HEAD
We would follow the procedures of the original paper, presenting both kinds of comparison stimuli in experimental blocks, and including blocks of control trials. The block order would be counterbalanced across participants.
=======
The procedures will follow the original experiment. The subjects will receive a set of training trials, and then a set of practice trials, followed by the experiment. The training will have to be slightly adapted to have programmatic rather than experimenter feedback, but otherwise it should proceed as in the original experiment. On a trial, the subjects will be presented with (rotation trial differences from control trial in parentheses):

0. A set of 4 consonants to rehearse & remember during the trial.
1. A cue of a (rotating) pinwheel for 2,400 ms (with rotation sound).
2. The image of a cross.
3. A blank screen (with rotation sound).
4. The (rotated) cross, possibly with its color order permuted (or with an incorrect rotation). 
5. On 25% of the trials:
..1. Test memory of the consonants.
..2. If memory incorrect, provide auditory feedback, and 3s delay.
>>>>>>> parent of 08203f1... editorial fixes to paper_choice.md

