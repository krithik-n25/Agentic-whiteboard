# AI Features (Diagrams) + AI Extras

> Auto generated captions. Use this for concepts, order of steps and what the
> author is trying to build. Variable names, spelling and exact syntax may be
> wrong. Write the code in the existing project style, and check library docs
> for current APIs instead of copying anything from here.

## AI Features (Diagrams)
Video range: 3:45:12 to 4:39:23 ([open at start](https://www.youtube.com/watch?v=mXSt_YSlp-U&t=13512s))

[3:45:15] Let make our whiteboard more powerful by adding an AI feature. Now if you see inside this note I
gave the step-by-step guide how this AI feature will actually works and how to add it. Very first
step that we need to add a floating button uh called for the AI and it always visible and it will be
uh easy to access for anyone. Obviously you can add this uh AI floating button whichever position
you uh you want but right now we'll add it to the bottom right corner. Then on the click of it, it
will open the floating sidebar just above this button. Okay. And on this one, it will show an AI
tool option like generate the diagram, flowchart, architecture diagram, even a mobile wireframe,
mockups, web wireframe

[3:46:06] and many other things which you can add it. Once you add couple of them, how to add it? Then you can
add whichever type you want. Then an option to enter the prompt. And once user generate with an AI
it will automatically start generating the diagram for us. Basically we are going to add an AI model
behind it kind of it's a act like a agent to generate the diagram it will understand the user
requirement and then once the JSON is generated which is compatible to the Excalidraw then we are
going to add it to the scene as simple as that. And then if you see the fifth step, it will show
this beautiful generated diagram for you. Okay. And inside this, I already gave the complete flow uh
the

[3:46:51] step-by-step guide how you can generate it and everything. So with this uh AI feature, user don't
need to write or draw everything manually. Once user added, user can make the modification in that
one as well. And everything we are going to implement. So first thing, let's go to the visual
studio. I will close all of this tab for now. And inside this workspace only we are going to add a
new component called AI floating sidebar dot tsx. Then we'll add a default template for it and then
save it. Now inside that we are going to show the sidebar. Now in order to add a floating button

[3:47:40] for the AI inside the whiteboard we are going to add that. So at the bottom side we'll add a div and
then inside this we'll add a button and we'll just call we'll add an icon called sparkles icon and
then we'll say AI. Now to this div we'll add a class name. We'll make it absolute. Then we'll say
right to 15 and then bottom to 10. And then save it. Now if I go back, make sure to reload your
application. Uh so over here, let me close this. So right now if you see it's not visible, right?
That's because it went behind

[3:48:27] this canvas. So you have to give index something like Z50. And now if I refresh it, you will see
this button. Now make sure it will be uh in the line of this one. Now this question mark it just
show the shortcuts. So we are going to add just um in the line. So maybe here we can say bottom to
five. I think this is good. Just I will increase the button size to large. And that's how our own
custom button is ready. I think you don't need to give anything. Let's make it zero only. I think
with zero. Oh, zero is taking too much down. Make it two. I think uh you can just set this up.

[3:49:18] Okay. Now after this uh adding this button, right, we have to make sure on the click of button it
will show this AI protein sidebar. Basically we have to hide and unhide it. So I will add that AI
floating bar sidebar component so that it will be visible when user click on it. Okay. And we have
to add a condition as well. So at the top we will write constant. Here we'll say uh show AI sidebar
comma set AI sidebar we'll say set AI show sidebar is equal to use state and initially it will be
false now whenever it's true

[3:50:08] we are going to show that sidebar so we'll just say show AI sidebar when it's true then we're going
to show this component Now inside this two first obviously we have to make sure the position is
absolute. We'll also give J index to 50. Then we have to make sure we have we [clears throat] we
need to uh make it to the right 15. And I will say bottom to let's say 15 or let's say 10 only. Now
if I refresh it, obviously it will not show because we did not add any button event to this one. So
we'll say on click set show sidebar and I will make opposite

[3:50:54] whatever the current value is we'll make opposite. So it will also help us to close it. So we'll say
show AI sidebar. So if I click on it or let me refresh and if I click if you see this AI floating
sidebar text is showing. Okay, currently we don't have any information but I think that's good. Uh
for a bottom we can add more value. So let's say bottom to 24. So it will be little bit up. Now next
thing uh once you add this over here we'll add a specific width. So let's say 380 pixel and then I'm
also going to add a maximum height to it. So let's say uh 620 pixel it. Then we'll we'll also say
overflow

[3:51:42] hidden. Um if you want you can add a border. I will make a rounded to excel. Little bit of shadow
and we'll make background white. Now in order to view it let's click on it. And this is how it look
like. Currently its position is absolute. Um so as soon as you start adding the content then you
will see a proper result. Okay but for now that's completely fine. If you give some specific height
let's say 300 pixel then you will see this floating bar. Okay. Next uh for this div I'm also going
to add some padding. So we'll say padding five for now. Now uh let's implement the header. So um

[3:52:32] we want to give the name what is the name uh or the title for that um sidebar. So over here I will
add a div. Then inside this I will again add one more do here I will add a sparkles icon and then
we'll say AI helper. Okay, you can give any name which you want and let's wrap it inside this H2
tag. Then I will make it class name. We'll make font bold text to 2XL and save it. Obviously make
sure to change this uh view this every time when you are uh implementing.

[3:53:20] Okay. After that uh for the testing purpose, right? I will make this value to true. So every time
you don't need to click it and if I click on it see able to view the actual value. Um next inside
this AI floating bar here instead of bold we'll make this medium and then on the right side I want
to add a cross button. Basically this button will close the dialogue. Okay. Now this button I want
on the right side. So we'll say class name flex justify between and then item in the center. So this
is the close button. U over here obviously I want icon and everything in one line.

[3:54:08] So that also we set up. Perfect. Next, below that we want to add uh let's add just P tag and inside
that we can say turn ideas into visuals in seconds. Over here we'll add a class name. We'll give
text gray color and text smaller. Perfect. Then we want to show the list of different option we are
going to add. So over here we'll say constant AI tools or AI uh let's say tools only and then inside
this you can give the tool name. So we'll say name uh generate

[3:54:55] diagrams then you can give a oneline description if you want. So small description if you want to
add. So here we'll say generate diagrams in seconds. After this you can also add an icon which icon
you want to use. So I use this icon and you can use some hex color over here. Okay. Or you can
simply something write like this text blue 600. Okay. Now same way you can just simply copy and
paste it with a different uh exam different tool. Okay. Now here I added uh some extra like
flowchart architecture web mockup and the mobile

[3:55:42] mockup. Okay. Once you have this AI tools ready simply you just need to uh render those. So over
here maybe outside of this div I will just going to render this AI tools. So we'll say AI tools dot
map we say tool, index arrow function. Here we'll add a div. Then we will say key as index and then
inside this uh we will show a two um um tools in one row. So over here we'll add an icon first. So
from we'll

[3:56:31] say tool dot icon but tool icon is already we added it as a component so I don't think so we need to
wrap it uh we just need to wrap inside the curly braces then we'll add the name of the tool so we'll
say tool dot name. Now let's see what is rendering first. So if I refresh it, you will see the icon
and the name is getting rendered. Now I will just wrap this inside the div and then save it. So that
uh you can add some styling later on. Now for this

[3:57:17] complete div again I'm going to wrap or maybe what we can do we can just move this outside outside
inside the another div and you can remove this one okay now next along with this you can show the
description but I want a description in just one line so we'll say line clamp to one and if I
refresh you will see that information. Now let's tile this. So for this div we'll add a class name.
Then we want to add a dynamic value. So we'll add this one. And then inside the curly braces. So
we'll say dollar curly braces tool dot color.

[3:58:08] And actually we want a background color instead of text. So right now if I go the text color if you
see it's changed to text color only. So that's good. But we also going to add a background color. So
instead of this text let's add one more value to it. After this you can just verify the background
and the main color. Now obviously over here I will add a padding. Say let's say padding to two. And
now let's bring everything in one line. So to this div I will add a class name. We'll make it flex.
Then we'll say item to be in the center and gap to let's say two. If I go back, let's refresh this.
And

[3:58:54] then this is how it [clears throat] look like. Perfect. Pretty good, right? Now next thing we have
to make sure uh the text uh we have to add a styling to this one. So we say class name and to this I
think let's keep this one as it is. But for this one we'll say text extra small and then text gray
to 400. And then we want to add a border to it. Okay. Over here we'll also make sure to add a
rounded medium. Then we'll add some padding with a border and with a rounded corner. Then we want to
make in the grid format.

[3:59:39] So to this div we'll make sure to add a grid and then we'll say grid column 2. Let's save it.
Refresh it. Okay. So there is a problem. Obviously we need to add this grid above to this one. Okay.
Because And now you will see this grid. So over here we'll also give some gap. So we'll say gap to
two. Um I will make this rounded corner to small. And then refresh this. So this is how it look
like. I think we should also make this text uh smaller. And we'll also do the line clamp to one. So
it looks good to for this particular grid right and

[4:00:31] um over here I think let's make this medium only instead of excel okay now next thing we have to
make sure we also give some margin top to let's say four so uh it will be differentiate from this
top section now you can generate this kind of UI directly with the help of AI it's totally up to you
how you want to handle it. Now next thing um below that we want to add an option to enter the input.
So we'll add a div inside this we'll say describe what you want to create and then we'll add a text
area. Now this text area component we are adding from the react only and then we'll add a

[4:01:20] placeholder for example here we can say our customer onboarding flow with uh decision points
something like this right and below that we want to add a button so this button basically help to
generate with the help of AI. So over here I will add icon first and then we'll say generate for
this button. Let add a class name. We'll make it flex gap to two item to be in the center. Save it.
Let's refresh this once. And then if you see the

[4:02:06] button is everything is here but just give some update to this one. So we'll say class name flex gap
to two and we'll make it flex column. Now once we designed this one and you think okay we can uh I
want much better version. What you have to do you can simply copy this code as it is then open a
chart GPT and inside the chat GPT you can simply paste whatever the code you have. After that you
can simply say um update my UI and make it more professional or whatever the things that you want
what you want to change you can just mention and make this

[4:02:53] floating sidebar uh professional looking and then hit enter. Now once it generate you can simply
copy that. Now once you copy simply paste it here and now if I go back refresh it and this is how it
look like. See now obviously whenever I select anything you will see this value is getting changed
and that's what we wanted. So AI will automatically understand what you are looking for now. You can
use the AI just for the design purpose to make it more proportional right because as I say in the
beginning that we are implementing this everything from the scratch with writing the code line by
line and we are not using AI.

[4:03:39] But there is exception obviously in if you want to use and update your UI design then definitely I
will suggest you to um help get help with the AI like chart GPT cloud or Gemini. Now when user click
on generate button we want to add some loading state and also we are going to show uh on the canvas
as well. So in order to add the loading state on the canvas first we'll go back and go to this AI
floating sidebar at the top we are going to u get the API okay the Excalidraw API so over here we'll
say Excalidraw

[4:04:25] API which we are going to accept uh we'll provide a type as a prop at the top we'll say type props
And then we need this API. Make sure you provide a type as well. So we'll say XL draw API and make
sure to import our null value. Now from the parent component which is the whiteboard we have to pass
that Excalidraw API because we already have so basically uh if you want to add any scene that can
added by from this AI floating sidebar

[4:05:13] as well and that's why we added this uh API. Now next we'll uh we'll import another one another
statement but we'll that we'll do that in later on. Now first we need to get a canvas position.
Okay. So empty canvas position that is very important because for example if we already have a lot
of element defined and then on that element for example if I want to add u that new getting
generated AI diagram we need an empty space and on that empty space we also want to show a loading
state. we'll say constant elements. So first we'll get all the elements. So we'll say excel API dot
get

[4:06:01] send elements. So from there we will get the elements and we have to make sure which does not
contain any deleted elements. So here we'll say element which is not deleted. So is deleted and make
sure it's not right. So it's not deleted. Now we have all the elements which is on the canvas. Now
over here if we'll check uh if elements dot length is equal to equal to zero means we don't have any
element then again we'll return the same position. Now this will actually do what I will do if that
API is not defined then we'll show the this position or if the element is not there then we'll add

[4:06:46] again on this xy position. Now we need to check what is the rightmost uh element because whatever
the loading state or our diagram we are going to add we'll add it on the right side. So for that one
we'll say find rightmost element and for this we'll say constant max right is equal to math dot max
and then we'll map from each element. So we'll say element dot map inside that we'll say element and
then element dox plus element dot width. Okay. So we'll

[4:07:33] get the exposion and along with their weight and we added both the value and then from that we'll
get uh the list of max right right and then we'll again uh get the minimum top again we'll have to
do my oh sorry math dot minimum and then we'll say dot dot dot elements dot map we'll say element
and then say element dot y position. That's all. Now we have the uh max right and top. Now we'll
simply return the result. So here x position will be max right plus 150 and then the y position will
be main

[4:08:23] top. As simple as that. And from there we'll get an empty canvas position. Okay. Now we'll create
one placeholder ID. So we'll say constant AI placeholder id. Now this ID only use whenever we want
to add this loading state. So we'll say AI generation placeholder. You can give any name. So this is
just a constant. And then we'll create a loading placeholder. Now now placeholder is nothing but the
element only. So we say constant add AI placeholder arrow function and we'll check if Excel API is
not

[4:09:12] there we'll return nothing then we'll say constant position is equal to get empty canvas position
and then we'll say constant placeholder elements. Now you have to define the design how you want.
Okay. Now for that one we have to use a convert to Excalidraw elements. Okay. This is very
important. Now make sure this particular um function or method we have to import from the
Excalidraw/ Excalidraw. Right? So this is the import statement for that one. And then we simply add
the list of array. So what is

[4:09:59] what you want? For example, I want a type rectangle. So make sure to add that. Then the ID. Now ID
is very important. So I I will I'm going to provide a same ID like AI plus older ID which we define
at the top. Make sure it's in curly braces. That is important. Then you have to give X position. We
already have the position uh calculated. So we'll say x position dox then the y position we'll say
position doy. Okay. Now obviously from this get empty canvas position we once we have the position
then we'll put it inside x and y then we'll add a width. So you

[4:10:46] whatever bit you like you can add it. I will say width 420, height to 250 and then you can add
background color, stroke color and all of this information. So something like this. Now this is a
stroke color which I added which is nothing but a border color then fill style the background color
and all of this information. Then once you add that simply save it after this. Now whatever the
element you created right because we already defined this element the call placeholder element that
element you need to add it to the canvas. So first we'll say current elements is equal to excel.
Aapi dot get scene elements

[4:11:34] and uh whatever the current element we have we have to add all together. So we'll say Excel doment
dot update scene which we already use this method right update scene. Now inside that we'll say
elements and then we'll say current element and then placeholder elements and save it. Perfect. Now
this add AI placeholder we need to call whenever user click generate button. Now we already have the
generate button over here and on the click of generate we need to call. So I will create a one
method called on click generate. Now this method we'll create at the top.

[4:12:21] We'll say constant on click generate and the arrow function. And inside this we going to call this
add port placeholder. Make sure the name is correct and save it. Okay. Now, let's test this out. So,
we'll go back. Let's refresh this. And you can select any type. You can add any uh prompt. And then
click generate. And boom. If you see, if I click generate, we got this beautiful uh rectangle added
automatically. If I click generate again, see it will not overlap but rather it will take the
current element position and then it will add 150 from pixel from the x-axis and then it will

[4:13:07] add uh that to the right of the existing element. Pretty cool, right? But here is the problem. When
you click generate it, it keep generating or adding new elements and we don't want otherwise it will
call a multiple uh diagram. Right? Now to avoid this u you can just simply restrict it but for now
what we'll do we'll add few more elements into this one let's say some text and all of that data. So
you can inside this element you can add more uh object like text type then the loading uh there is
no loading but you can assume and you can make it feel like okay it's showing a loading state. Now
for example uh I already have these two elements for the text which I'm going to add. And so
basically the

[4:13:58] first text will show generating with AI. The second text will show preparing your diagram. And now
if I test this let me refresh and click generate. Then if you see this is how it look like. Okay.
Generate with preparing your diagram. Now let's say you want to add and enhance this more right you
can add some kind of skeleton style design. So I will add that one as well and if I refresh click
generate then you will see the skeleton style design and we'll keep this one and it look good right
it means user know that okay is getting generated obviously you can show a loading

[4:14:43] indicator over here so that user uh know that okay uh is generating. So that's how we have to do it.
Okay. Now, next thing we need to call an API and along with that we have to pass the prompt for each
of these design. So, I already added our inside our documents um related to each of the tools and
along with their prompt. We already have the name, description, icon, background, color but now we
have to add prompt for each of them. So simply copy that as it is and then under the AI tools you
have to add this. See you can move this AI tools if you want. So I will ct controll X and I

[4:15:30] will put it at the top and save it. Now once we have the prompt along with the existing system
prompt for each design and with our user enter prompt we are going to pass it to the AI model which
will generate the Excalidraw elements and then that elements which is in the JSON format will add it
in place of this uh loading element. Okay. So it will be on the canvas. Now once user click generate
now we need to make an API call to the AI model. Okay but before that let's set up other ong
generate click method properly. So inside this floating sidebar when user click generate right so we

[4:16:21] already have this on click method added and inside that we are going to accept the selected um
option right so whether user selected architecture web flow flowchart and along with that what user
entered so we'll define two state first we'll say constant selected uh type comma set selected type
is equal to use state. Okay. Now by default I will pass the first one which is the flowchart and
from the tool you can directly add that complete object as it. So from this AI tool of zero I will
save.

[4:17:09] Okay. And then we also want a user enter prompt. So we also save that user entered prompt or we say
user input easy comma set user input is equal to use state and initially it will be empty string.
Now let's go ahead inside the text area and here we'll say on change we'll pass I will get the event
is equal to set user input and then we'll say event this need to be an arrow event dot target dot um

[4:17:59] value. So we'll get the value which user entered and whatever the selection that we are going to
make that also we need to set. Okay. So we already have this set selected tool. So we don't need to
add this selected type selected tool already um use to get the data. Uh right now it's saved as a
string that's completely fine. From that string we can easily calculate the um tool prompt which we
want. Now on the click of generate let me show you in the console what data we are getting. So we'll
say user input and for user input I will say whatever the user enter that input we'll get and let's
say selected tool and from that

[4:18:45] one we'll get the selected tool. Now if I save it, let's refresh this and then I will click on the
inspect panel and make sure to open the console. So you can verify it. I will refresh this once and
then when user select any of these option user enter the prompt, click generate and then you will
see a user input and the selected architecture because we selected as a selected role as a
architecture, right? So that's how uh we are getting this value. Now whatever the tool we selected
from that tool, we need to get all the tool information from this AI tool. Now in order to get that,
it's quite straightforward. So we'll say constant

[4:19:33] current AI tool is equal to AI tools dot find. Then we'll say tool and then we'll say tool dot name
matches with the selected tool. So make sure it will match with this tool name and from that one
obviously we'll get complete object. And now inside that object obviously we have the prompt and all
of this information. See now we have the current AI tool. We are also adding the placeholder. Now
let's make API call. Right now for that one we'll just simply say uh constant result is equal to
await Axios dot then we need to add

[4:20:21] post method. So we'll say post / ai / model. So we'll or just we'll say AI. Okay. So this AI
basically help us uh to means this AI API endpoint will help us to generate the diagram right and
then we'll pass a body inside the body we'll pass a user input as user input then we'll pass this
complete object as it as it is. So AI tool and then we'll pass or we can say simply type and then
pass this current AI tool or if you want you can simply say type as

[4:21:06] name and then system prompt then we'll say current AI tool dotp prompt okay so everything will get
in the string format As we are using await, I will mark this as a async and then save it. Obviously
later on we'll also console the result. So we'll say result dot data. Now when you click on generate
right obviously it will take time to load it. So we are also going to add a loading state. So we'll
say loading comma set loading is equal to use state and initial value it will be false. When user
click on on generate we'll set the loading as true and once it finish we'll set the loading as
false. Now obviously we don't

[4:21:56] want to set loading false immediately. Obviously it will uh set false once we have the result. We'll
remove this console for now and save it. Now whenever the loading state is true we need to show a
loader. So here we will say if loading is true um then I will add add loader icon and then I will
add a class name animate spin and also I will disable this button whenever the loading is true.
Perfect. Now obviously we need to add an API endpoint. So we'll go to this API. We'll create a new
folder called AI only. And inside this we'll add route dot ts file.

[4:22:41] Now we'll say export a sync function. And this will be the post request. And here we'll say next
request. First we'll say request and then next request and then save it. Now inside this obviously
we'll get those all the value like user input then the type and then system prompt and here we will
say use sorry not await request dot JSON. So from this um body we'll get all of this value. Now once
we have this value, it's time to implement an AI model. And for the AI

[4:23:30] model which you can use any AI model which you think is good but for this example I'm going to use a
Google's Gemini AI model. Now it's free to use as well. Simply you have to go to the AI
studio.google.com and here you can play around it on their playground. So basically if you want to
use a text AI model you will see we have number of different option right you can use whichever you
like and once you select it for example we have Gemini 3.7 flash uh the flashlight and many others
select that once you select you will see an option called get code just click on it and then make
sure you select it as a TypeScript and here you will see the sample code okay this basically help us

[4:24:17] to generate the proper uh response from the AI model. So for that one first you need to import this
Google gen AI right. So you can simply search on Google Google gen AI you will find this npm package
simply copy this npm command then inside your directory or inside your VS code terminal simply
install this chain AI. Now you can use direct code as it is totally up to you or if you want to make
it little bit simplified that also you can do it. Now over here uh on the right side setting right
you have option to add a tool. Now if you want to add a Google search you can add it otherwise you
can disable it. If you want a structure output that also you can do

[4:25:05] it. Okay. Now here you can add a property and what kind of structure output you want or you can
simply add uh inside this code editor. So first we'll just copy this AI initialization where we are
passing this API right make sure to import this Google gen AI. So I will copy this line as well and
we'll paste it here. Okay. Now we need to add a Gemini API key. So go to this env file where we
added a lot of other things. Also add a Google API key. Now in order to generate the Google API key
you can simply head to this a get API key and here you have option to create a new API key. Once you
click

[4:25:53] create key simply copy that key as it is and then you can add it to your env file. After this we
need to generate a final prompt. So we'll say final prompt is equal to now first we'll say a user
for first we'll add the system prompt. So we'll say system prompt and after that we'll say user
request and then we'll add a user input. Okay. And after this adding a user input you can add uh the
canvas generation rules. So I already have that. I will share this with you. So simply paste that.
So this is just a rule. Okay. Uh it's totally up to you whether you want to

[4:26:41] add or not. But obviously once you add it, it will be easy. Okay. And then save it. Now once you
have the final prompt then we'll move to the here we'll say constant response is equal to await AI
dot models and then we'll say generate content. So we are adding this logic on our own and inside
this we need to give a model name. Now in order to get a correct model name you can head to the
dashboard click on it and then you have to copy this model name. See after that simply paste it
here. Then we have to provide a content. So here we'll say a final prompt and then you can add

[4:27:29] a configuration. Uh in that you can add the response schema and other information. If you add the
response schema right it will give you the result in the same format. So let's add that too. So
we'll say config then we'll say response mime type as application / json and then we'll say response
schema and then you have to provide uh the complete schema. So I already have this schema ready
which I'm going to share with you. So we'll say constant response schema is equal to and simply
paste. Oh, so over here we'll say response schema

[4:28:18] and make sure to import the type from the Google gen AI. Okay. And now we have the type with the
string and all of this information. Simply paste it as it is and this response schema. Then I'm
going to add over here. Okay. So now we have the response schema as well. Then below that we'll say
constant diagram result is equal to JSON dotpass and from the response so from the response we'll
get a text value otherwise return the empty. So it will basically pass into a JSON and then at the
end you can simply say return response dot JSON and then we'll say

[4:29:10] success or let me see okay that's correct. So we'll say success as true and then we'll pass. Oh here
you can pass this diagram result as it is because we already pass it and then save it as simple as
that. Now once we have the diagram result ready you can go to this floating sidebar and then here it
will uh show you inside the result dot data. Now for now let's see in the console whether we are
getting the proper result or not and then we'll attach that to the canvas. So let's go ahead and
refresh this. I will keep this console open. Now let's say you want to generate a simple

[4:29:56] diagram. So we'll say user authentication diagram. Okay. Now simply click generate and obviously
which will make an API call. So I will also open the network tab so that we can verify it really
making the AI model call or not. So click generate and if you see currently AI model generation call
is in pending status. Okay. And over here as well it's showing add generated or generating. Now
inside the console we got the success message and then we got the diagram result inside that we have
the connection elements title width and all of this information and that's what we

[4:30:42] wanted. Perfect. So it means we are getting the result inside the console. Now as we know that we
already have the result but once we have the result we have to remove this placeholder. So we have
to make some quick change here. we need to give an ID for each of the added element. Currently, we
only give id to the top section. So in order to add this id at the top, I will say constant first
and then we'll say ai placeholder ids is equal to and then we'll add id for each of them. So let's
say container is equal to AI placeholder container and same way you can add it for each of the uh
element. So I'm just

[4:31:29] going to paste it here and save it. Now for each of them we have the ids. Now what you have to do
for this element we'll say AI placeholder ids dot container. See? So I will copy that for the text
over here. We'll say text or we'll say title for this one. Uh this is just a subtitle and then we
have skeleton right. So for the skeleton we'll say skeleton one, skeleton two like that. So make
sure to update this. It is very important so that later on we can remove all of these placeholder ID

[4:32:15] and then we are going to replace it with our actual result. Now on the click of generate right once
we have the result we have to remove that placeholder. So we'll create a method for that. We'll say
remove AI placeholder and then here we'll add a condition. If if Excalidraw API is not there then
we'll return nothing otherwise we'll say constant placeholder ids is equal to object dot values and
then we'll add AI placeholder ids over here. So we'll get id from each of them. Then we'll say
constant

[4:33:01] elements is equal to excel. API dot get scene element. So whichever scene we have, we'll get all of
those element and then we'll say constant update elements is equal to elements dot filter it out
because we want to remove the placeholder. So we'll say elements and then placeholder ids dot
includes element dot id. Then we want to filter those out and whatever the remaining element is
there which is uh not a placeholder that we'll update with that scene. So we'll say Excalidraw API
update scene and then we'll say elements dot update elements.

[4:33:52] We here we just need to add elements and then we'll say update elements. Okay, make sure it's inside
the curly braces and save it. Now this remove AI placeholder we need to call over here. Okay after
generating the result. Now once we remove that right now if you want to test you can verify it. Let
me refresh it and obviously before going to the next step we'll verify. So we here we'll say user o
flow and let's say flowchart you want to generate. Now if you click generate if you see it's loading
but right now uh we want to show before generating the result. So right now it's

[4:34:40] little bit different way. So let me go let me move this AI placeholder at the top. As soon as it
click generate then we want to add this placeholder and later on we are going to remove it. So let
me refresh it again. user oflow. Click generate. And if you see it's there now currently it's
generating. And once we get the result we our expectation is to get rid of this u placeholder and on
click generate. If you see it's gone. Okay. It means we don't have that placeholder anymore. That's
how you have to make sure you will remove that placeholder.

[4:35:27] Now we also learn how we can remove the existing placeholder and we also have the JSON data which is
generated by AI. Now it's time to render those on into our canvas. Now rendering is quite simple.
You just need to update your scene and then whatever the things you want to pass like elements its
proper position everything you have to update and then it will render it properly. So I already have
the code ready for it. So it will calculate the connection points as well. So when one box connect
to the other right we need to show connection. So that is about the get connection points and along
with that we also have the render AI diagram method. So I properly comment out all of this
information with the diagram origin uh to find the node create a shape all of

[4:36:14] this I added inside the code. Simply paste that inside your AI floating sidebar. And over here if
you see we have this render a diagram and then just above it I also added this get connection
points. Okay, it's very easy to understand. So you can simply uh paste this and make sure you will
read it before uh test this out. After this make sure to refresh your uh screen and let's say you
want to build a signin screen. So here we say signin screen and obviously I selected as a mobile
mockup. I said generate. you will see the placeholder and then once it generate it will replace the
placeholder and then it will update it with the actual sign-in screen. Now obviously this signin
screen if you see this is how it look like. Now

[4:37:01] this signin screen come with the proper color combination and then also along with that if you see
we also have the sign up option. Okay. Now I also updated this route prompt. Okay. So, so that it
will add the color rules and the rem recommended palette setting as well. But if I just undo this
changes and save it and refresh this now, it will only show you the prop uh basic layout. Let's use
a same example. We'll say sign in screen. Click generate. And the most important it will give you
generate result much faster. See now let's say you want to do architectural diagram. So we'll say
sample example we want to know. We'll say generate it will it generated this

[4:37:48] placeholder and then it generated this connection as well. Right now it's little bit complicated
because the text is much bigger but once you describe your idea properly then it will give you the
better result. Now for the web markup let's say you want to add a landing screen example and then
click generate then it will give you the landing screen layout and this kind of feature you will not
find anywhere um in any whiteboard this particular whiteboard will give you this feature and if you
see we have this landing screen but as I say if I updated our system prompt then it comes with a
different result okay now let's start generating I know we did not refresh our screen but still u
our route is updated. So automatically it will give you the uh

[4:38:38] latest result and boom if you see for the landing screen now it come with some colors and more
information. Now obviously uh I will definitely suggest that you can update the prompt and you can
also write that you want a minimum uh text. Okay, because right now it's added too much text. So
instead of that we can keep it a minimal text design. So I hope you understand how easily we added
this AI helper with the different uh tools in that one and we also integrated with the Gemini AI so
that you can generate the diagram whatever you want and we can directly add it to our um whiteboard.
If you any question any doubt let me know in the comment section or you can ask me on my Instagram
channel or discord channel as well.


## AI Extras
Video range: 4:50:00 to 4:51:54 ([open at start](https://www.youtube.com/watch?v=mXSt_YSlp-U&t=17400s))

[4:50:04] Now inside this I added couple of more interesting feature which is a notes and emoji and also AI
helper which is act similar like this AI button. Now on this note section if I click on it it will
give you the option just click on it and it will add the note for you and then you can uh start
typing inside this note. It's very easy to implement. I will uh also share the code for this one.
The complete source code you will available on the tube guruji.com. I will put in the uh source code
link in the description. After this we also added this emoji section where you can select the which
your favorite emoji is and then you can simply add that to your canvas. Okay. And obviously you can
do

[4:50:52] all the operation the same way. Along with that we also added this icon section where you can add
the icon directly inside your u canvas. See and then you have option to make all the different uh
changes to this emoji as well. You can copy paste this. See pretty cool right? So that's how uh the
emoji works. So these both the features u make sure you can install it. Obviously there are a lot of
feature you can add to your whiteboard but as a beginner purpose uh this whiteboard is pretty good
functional and now as you know that we already have the save function ready you just need to simply
unccomment your changes. So inside the whiteboard um if you remember we just

[4:51:38] commented the u save functionality right see over here and once you enable then going forward it
will keep saving your um canvas or whiteboard information to

