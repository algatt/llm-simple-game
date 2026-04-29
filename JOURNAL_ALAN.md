### Prompt 1

i want to develop a simple game in javascript. I want all elements to be modular, so that they we can followi a plug and play concept. i want to build this game iteratively. we add elements as we go along. I want you to start with these things: add a file JOURNAL.md where you will log your progress, preferences, lessons learned etc. and start a preliminary research on the basics for instance which game engine shall we use.

### Prompt 2

ok great let's start with a simple setting up. initialise phaser so that we can see something in the browser.

### Prompt 3

ok it worked, i have run the server on 5173 and i can see phaser setup. ok now i want to set up the world. I want a sky element, a terrain element. for now you can split them 50/50.

### Prompt 4

There is no need to run build everytime, i will check manually.

### Prompt 5

ok so the intention is now to have the player ride a bicycle on a road that never actually ends, but it can swerve to the left or to the right. so for now i want you to create a road element that is placed in the middle of the terrain; but it must be parametrised so that it can curve to the left or to the right by an x amount.

### Prompt 6

I want the curve to be worked out differently, right now when i set curveX the road simply shifts diagonally, i want it to actually curve.

### Prompt 7
ok much better. now let's start planning the player before we continue to work on the road. for now the player can be a cube. and make this cube move left and right using a and d

### Prompt 8

ok, now let's add the player speed. add an indicator on the top of the screen with speed. when 'w' is pressed speed increases, and when 's' is pressed speed decreases. make sure not to go beyond limits. when speed increases / decreeases i want the road the user to move on the road. so we must create a roadgenerator module, that generates the road in a random manner, but obviously making sure that the road is continuous and behaves in a natural way.

### Prompt 9
Looking good, but the road behaves unnaturally it is twisting too much we need a more natural flow like actual streets. also limit the speed from 1 to 10.

### Prompt 10

Ok i need longer straights, and more sharp turns when they happen. This contributes to the game since later on if the user will go off road we will deduct health.

### Prompt 11

Ok some refinements, can you make the yellow line in the middle dashed, and can you add better perspective and a bit of fading the farther away the road is

### Prompt 12

alpha on the road does not work well i can see the grass underneath

### Prompt 13

ok now let's start adding some scenery. create a house module that genereates a house. in order to have some variety, set some paramterised values like height, windows, type, etc... then use a random generator to place houses at random intervals on the left and right sections of the road.

### Prompt 14
don't make houses transparent they don't look nice. Also we need the houses to be bigger since right now they are the size of the player. We need to add some logic that the further away they are the smaller they look and they increase in size the closer they get. the house with the triangular roof; the roof is offset.


### Prompt 15
triangular roof is still not on top of rectangle.

### Prompt 16

nice. push the houses a bit away from the road

### Prompt 17

ok now i want the same sort of generator but for trees this time

### Prompt 18

now let's add health, same bar 1 to 10, and if the player gets off the street and collides with a tree or house deduct health depedning on the speed they are going.

### Prompt 19
ok. now let's add a points system. it increments depending on the road covered determined by speed. if the health reaches 0 game over

### Prompt 20

what do you tink about the player, can we make it nicer?

### Prompt 21
the bicycle is being viewed from the side but we should see him from the back

### Prompt 22
since we're looking from the back the wheel should be looking from the back as well, not a circle!

### Prompt 23

I noticed that if the street bends and i do not touch controls the bicycle goes along with the direction of the street this should not happen. also when player collides reduce speed to 0

### Prompt 24
upto this stage what would you to make the game nicer?
...
Implement them all at once


### Prompt 25

anything else?
...
ok add them all


### Prompt 26 (EXTRA)

can you get some music from public urls and use them instead?



