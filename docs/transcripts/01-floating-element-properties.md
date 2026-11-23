# Floating Element Properties

> Auto generated captions. Use this for concepts, order of steps and what the
> author is trying to build. Variable names, spelling and exact syntax may be
> wrong. Write the code in the existing project style, and check library docs
> for current APIs instead of copying anything from here.

## Floating Element Properties
Video range: 3:09:52 to 3:45:12 ([open at start](https://www.youtube.com/watch?v=mXSt_YSlp-U&t=11392s))

[3:09:56] Now when you select any element we want to show uh a properties uh toolbar right. So basically if I
want to change the color or add a color to this particular uh square or any elements right I should
see an option to change it. Even if I want to uh change the opacity width of these borders and
everything you should see that option and that's what we are going to add it. So we are going to add
a custom property toolbar and this is how it look like. So as soon as you add the element and select
that element you will see this toolbar option where you have option to select it a different
property from it. So uh inside this node I already show you how it works and

[3:10:41] everything. So the step-by-step guides to implement as well and we have to make sure for each
element the property might be different right. So you we have to keep that in mind as well. So let's
start implementing it. So first thing we'll go to the visual studio and inside this whiteboard. So
we have to add two states. So we'll say constant selected element. Then we'll say set selected
element is equal to use state. So basically this uh element will hold the value of use selected
element. Okay, you

[3:11:28] can provide a type any and we also define one more state to um save the canvas. So we say canvas
state, set canvas state is equal to use state. I'll provide a type any null and then save it. Now we
have to make sure that we will save or we'll set the selected element value that you can do it
inside the handle canvas change because we already uh know whenever the canvas change right uh from
there we'll

[3:12:15] get to know which element is selected so over here first I will set the state because we already
have the app state right and then we'll find the selected elements so over here is constant selected
ids because each element that we are adding has a different uh ids. So we'll say object dot keys and
then we'll say app state dot selected elements or sorry just element ids. Okay otherwise null. Now
obviously this will return the list of ids. From that we have to make sure only one element is
selected. Right? So here we'll say if selected element dotlength

[3:13:07] is equal to equal to 1 then we'll say constant element is equal to elements dot find and then we'll
say element element dot id is equal to equal to selected ids of zero and then after this we can
simply say set selected element is equal to element. So now we'll get the selected element otherwise
else we'll say set uh set selected element will be null. So right

[3:13:52] now we are just capturing only one element. Okay. and then only um that selected element will be
saved. Now in order to test this out um over here just above this return I will console the selected
element. Okay. So we'll verify whether the selected element is correct or not. So inside the inspect
panel um in console you can see. So first I will refresh it. So right now um we are getting error.
It's saying each child okay this we just this error we need to ignore. So here it's saying navigator
is not defined and cannot read property length. So let's go over here

[3:14:41] add this question mark. I think we are good. So let's add one element. Okay. Now if I select this
element right now it look like nothing is happening. So let's select another one and it's still
returning null. Okay. So it means our logic is somewhere broken. So let's see why. Okay. So the
problem is right here we need to add a selected ids because we already have this ID right and from
there we have to um get the length and we need to check. So let's refresh. Now let's add this value.
And now if you see if I select that I'm getting this selected element. So it's saying field style
solid index a zero the stroke color stroke style and everything. And

[3:15:27] later on that's the value we need to update. If I add another element you will see the ele another
element selected. But if I select both the element if you see it is returning null and that is
expected. Perfect. Now after this we need to calculate the position where we want to show our
floating toolbar. So that also we are going to calculate inside this only. So I will remove this
console now and we'll say constant get floating position and the arrow function. Now this position
will be calculated based on the selected element position. So right now if you see selected element
position give X and Y axis and from there we need to calculate it. So first we'll add a condition if

[3:16:17] there is a no selected element or or no canvas state then we'll simply return left zero and then top
to zero. Okay. So it will show on the left side corner. This is just if it fails. After this I
already have the code added inside the eraser doc to get the position which I'm going to paste it.
So basically inside this first it will calculate the zoom scroll X scroll Y then the center X. Now
this center is calculated from the selected element and then screen X screen Y and then it will just
return minus 6 because we want the top of the element right and that's why we

[3:17:06] calculate something like this. Now once you have that one you can simply say constant floating
position is equal to get floating position. You can calculate just about the return because so that
every time you'll get the updated value. Now you can even print this out the pro floating position
if you want. So over here we'll say constant sorry the console log floating position. Save it. And
if I select this item so let me see this is the oh let me refresh it because we have to refresh it.
And right now if you see we don't have any item selected the position is just left zero and once I
select the

[3:17:52] item you will see this position which is 406 and 101. So over here somewhere uh it will show that
floating bar. So that's how we have to add it. Now in order to add this floating bar right we'll
create a separate component. So let's go to the component folder. Inside the workspace, we'll create
a new component or a new file called floating properties tsx. Okay. And inside this uh I already
have the code ready. It's a huge code. So I'm going to paste it. This code is also available inside
the eraser doc. And once you add I will explain you uh shortly. So basically we are adding a

[3:18:38] different type whether it's a text or it's a shape. Now the shape include the rectangle, ellipse,
diamond, right? Then is a line, arrow or a free draw. And based on that it will detect whether do
you want to show a just text related property or line related property or a draw related property.
Right? And then we are already getting the selected element and its position. So that we are getting
from the parent component. It means from the whiteboard. After this uh inside the div based on the
type and all we are going to display a different different properties. So over here if you see there
are some common property if is a text then what are the different property we want to

[3:19:23] add like font and all of these things. Okay. So everything is mentioned obviously this is just a raw
but you can enhance these floating properties now. And then inside the whiteboard just below uh the
Excalidraw or maybe after this one as well you can add this floating properties. So over here we
just say floating properties and to this property property you have to pass a selected element and
then you have to pass the position which is a floating position and then save it. Now after adding
this propert uh floating properties component code which I'm going to share with you uh along

[3:20:09] with the complete code this is just a UI purpose right now. But if I go and let's add some element,
you'll see as soon as I select this element, I'm getting this float bar. And also if you click on
these three option, then you'll get some extra option to um add some property to the selected item.
And you can do it for any item. Say if you want to add arrow, you have some different property. Now
if you add a text, now text has a little bit different. So because text is a different property, it
has a different value as well. So for a text you have different font different size to select their
alignment the text color and all but for the line or for the other uh elements like shapes it has
some

[3:20:55] different property. So that is the difference between the uh text uh shapes or lines right. So this
is very important uh to add this floating bar so that you don't need to move your cursor too much.
You can just simply uh check and update the property. Also you can move this floating bar. If you
think it's coming in between your um shape then you can simply move and then you can continue your
editing. As simple as that. Right now this is just icon is not working because we need to add some
extra um feature. It means we need to make sure it is workable. But right now make sure the property
um toolbar is ready and you can view it something like this.

[3:21:42] Now once we add the UI for the property floating toolbar now it's time to apply those changes
whenever user is selected. So currently if I click on any of these right nothing is happening. So
let's try with one example so that you can implement for others. So we'll go to the visual studio
and then go to the floating proper uh floating properties. Now inside this I already have one
property called on property change. Okay. Now basically what it will do uh let's take this example
called stroke color. When you click on the stroke color it emit the event. Okay. and it will return
the color the stroke color the name of the property and the value. Okay, so that property we already

[3:22:27] returning back to the parent component through these props. See, so what you need to do you can go
back to the whiteboard where you implemented uh or imported this floating property component and
inside that add this on property change. Okay. Now obviously over here it will return the property
name I will say and then value and then you have to call or create a new method which will uh uh
handle your property change. So here we will say handle property change. Okay. And to this one you
can pass the property name and value. You

[3:23:14] can just call property that will be easy to read. And now we'll create this method over here. So let
me remove this console. And over here we'll say constant on property change. And inside that we'll
add a property of type string and value of type any because we don't know what will be the value.
And inside this obviously you can add a similar condition. If there is a no um Excel API so or no
selected element then it will return nothing otherwise we have to get the selected

[3:23:59] element. Again you can simply get it with this element or you already have the selected element but
you can define it again. So we'll say selected element is equal to API dot oh sorry Excalidraw API
dot get scene elements. Okay. So it will give you the selected uh element. Then we have to update
that element. So we'll say constant updated elements is equal to element dot map because you already
have that element right. So we'll say element do map. So we'll again say element the arrow function
and inside that we'll first check the condition if element do

[3:24:46] id is not equal to selected element do ID. If it's not same right then we'll simply return the
element. Okay, as simple as that otherwise so here we'll say return and inside that we'll say
element then the property and its value and then inside this we'll say version. So we'll say
version. Now this is the field that we need to pass to the API element right. So I will show you
how. So we'll say element dot version. So somehow it's not showing the version. So element

[3:25:34] dot version + one. I think we need to keep inside the same one. Okay. So this need to be inside the
uh updated element only. So make sure your bracket is out. And then after this version you you also
need to add updated the date and time. So we'll say date dot now. Okay. Now once you add that
obviously you have the updated uh element. So outside of this one now you can say API in our case is
just a Excalidraw API dot update the scene and then we will update the scene with a new element. So
we'll say elements dot

[3:26:19] updated elements. So basically we update the element only though only that element which is matches
which is selected element and that's why we have this condition and then we return the property to
this updated element. Obviously if just if it not selected element it will go as it is and then it
will update it and save. Okay. So let's test this out. So I will refresh the screen. Then we'll add
a square and let's change the color to purple. And if you see now it changed. If I change to green,
it changed to green as well. Perfect. Right? If you want to add a field, see it also work. Now you
might have question how it works because we use a same handle property change. We are just changing
the property and its value from

[3:27:07] the floating properties. Okay. And let me show you how. So this is one is for a stroke color. This
one is for background color. Then another is for background color transparent and text align if it's
a text. Okay. And likewise. So this particular um floating properties component you can simply use
it. If you have problem facing now if you want a dotted line see we get the dotted line as well.
Right. Let me remove this color. So we'll say no field for now. And let me move this on the right
side so it easy to show it. Then you can change the thickness however you want. You can change the
fill color. You can change the opacity. Everything can

[3:27:55] handle from here. If you add another one something like this say that also you can add it. Okay. So
if you want dotted so it works for all the elements and most of the property will work properly.
Okay. Now if you want to bring this front I don't know the front back is not working because that we
have to do it also the delete will not work but if you try to delete with your keyboard button then
it will get deleted that will again fix it. It's it's not like fix it but it's we did not implement
it yet. Now for the text that is very important. Okay. So I added this text. Then if I want this
text in the middle, left, obviously uh it's just one text. But if you change this font, you will see
the

[3:28:41] change. Okay. If you want to change the font size, it will it will also change the font size. Now
you can put it in the center as well. You can change the text color. Right? So that's how it
changed. And if you also change the opacity. Perfect. Now most of the property uh on the elements
it's working. Now there are few that we need to update. Now if I scroll up I already have the
property which is added here. So which is on delete on duplicate on lock and bring to front and send
to back. This property is little bit set in a different way. That's what we have to add now. Now for
the delete we already passing right. So we'll go to the whiteboard and over here I will accept the
new

[3:29:30] uh field or we will say ondee and here you just check what are the prop uh field we are passing. So
here if I click on delete it's just calling this on delete. Okay and let me go up I don't see any
property but now on delete what it will do it we have to make sure which propert which element is
selected and then we have to remove uh that property and then we have to update the scene. So over
here we'll say handle delete element. Okay. So I will call this method. So over here I will define
this method constant handle delete element. Now inside the handle

[3:30:17] delete element similar like this I will make sure the API is defined. Then we'll get the elements
using this method only. Okay. And the most important inside the so we will say constant updated
elements similar like above right but there's a little twist so here we'll say element here I will
say elements instead of just elements so elements dot map and inside this we'll say element and
we'll check if the element do id is equal to equal to selected element dot id. If it matches then we
have to return

[3:31:10] dot dot dot all the properties from the element then is deleted as true. After that you have to pass
a version. You have to just increase the uh existing version by one. So we'll say element dot
version + one and then when it updated. So we'll say date dot now. So if you see all these property
are same. Okay. Just we added one more property called is deleted to true. And then uh after this
we'll return this uh updated element. Right now we have this updated element with this new element.
So basically we'll just update the scene. Right? And once you update the scene, so

[3:32:00] over here it call elements. Then we have to make sure the set selected element is null now. Okay.
And then save it. Now let's test this out. So I will refresh it. I will add this element. I will add
one more element. Let's say you want to delete this element. Just click delete and it will get
deleted. See how quickly if you want to delete this one, it will deleted. So that's how you have to
delete uh the selected element. Now same way you can do it for the on duplicate, on lock or bring to
from send to back uh properties. Okay, you can try on your own but I will show you how to implement
that one as well. Now for a duplicate just imagine that you need exact same

[3:32:45] selected element just we'll change little bit position and then update the scene. So let's go to the
whiteboard. then on duplicate and then here we'll call handle on duplicate then call this method
constant handle on duplicate arrow function and as you know that first we'll check this we'll get
the element as well right after this we'll write constant duplicate element which you want to
create. So first we'll create that duplicate element. So first we'll add

[3:33:30] all the property of the selected element. Then we'll generate a unique ID. So you can use a crypto
dot random UU ID because this is important. Each U element has a different ID. Okay. So that's the
why we are giving some ID. Now we have to give X position. So from the select element doxosition you
can get it. But we don't want at the same location. So you can add let's say + 20 for Y. So we'll
say selected element doy + 20. Okay. So we are just moving the position little bit. Now this seed we
have to provide. So we say seed math dot floor and then we'll say math dot random

[3:34:17] into 1,000 or whatever value you want to give. Then you can add a version as a one because this is a
new element. Then we also have version nouns. So I don't know whether we need this one. Okay, we'll
just uh add updated with a date dot now. And then here we'll say is deleted because we don't want to
delete, right? So we'll say is deleted to false. Now you have the duplicate elements. So what you
need to do? We have to get the API dot Excel. Oh, my bad. So over here we'll say um Excalidraw API
dot update the scene.

[3:35:05] Now you have to make sure you'll pass all the elements existing elements right. So over here we'll
say elements then all the elements along with duplicate element. So let's test this out. So
hopefully it will work. Now if I add and I added this square. Now if I click uh duplicate see I got
another square and this is new. Now even though if you apply this change something like this right
now I apply this color. Um let's say you also apply the fill color and if I duplicate it it
duplicates same way. So that's how uh you have to implement the duplicate functionality. Now on

[3:35:51] bring to front and send to back is very easy. Okay. Now whenever you store any value okay through
the Excalidraw it we basically add a first element then below that the second third fourth right and
the last element will be on the top always. So that same logic we have to add it you have to get the
selected element and you have to put that at the last in order to bring it front and if you want to
send it back you have to move that item to the front. So we'll create one method for both of them
and then we are just going to switch it. So here we'll say um on bring to front handle bring front
back. Okay. And if it's front then we'll pass it as a front as a text. I will create another

[3:36:42] one on bring send to back. And if you want back I will say back. Now let's create this method. So
we'll say constant handle front back. Here we'll say type of type string and the arrow function.
After that we'll check if the element is there. If not it will return empty. Then we'll say constant
elements. So obviously we need to get the elements in the same way. So I will just copy the existing
line. Now you have the elements right now we'll say constant selected is equal to element dotfind.
So what it will do we'll get the all the elements or not all the element we'll get only

[3:37:30] the selected element first. So we'll say select elements dotfind and then we'll add element arrow
function and element dot id is equal to equal to selected element do id. So which will return the
selected element information. After that if the selected element is not there then obviously it will
return nothing and then we need to get the remaining elements. Right? So for the remaining elements
I will simply copy this one here we'll say remaining elements and then we'll say not equal to okay
something like this it means the selected element

[3:38:15] other than all the elements which is not selected so it will come inside the remaining elements and
now you just need to update the scene now in order to update the scene right here I'm going to show
you how to do it now I will add a condition if the type is equal to equal to front. If user want to
move this to the front, right? Then we have to add the elements and inside that we'll say okay I
want the um all the remaining elements first and then the selected element. So which I will say just
selected. Now here let's say ts ignore for now and then show it because selected then it will show
at the top

[3:39:02] else. So we'll say else just copy this as it is but over here we'll put the oh let me put this
selected at the top so it will automatically go to the back and give comma. So let's take this out.
Now I will add this square and we'll change this color to green. I will add this circle. Let's
change the field color to this one. Now currently if you see circle is at front. Now let's send this
circle to back. So we'll say send to back and nothing happened. That's cool. So let's see why. So if
I send the back, it doesn't work. Or even if I select this one says bring to front, it doesn't work.
So let's see why it's not working.

[3:39:51] So here is the issue. Right now here we need to filter this out not find. Okay. So you have to make
sure you will pass a filter and that's why we we are getting this error. Let's remove it and let's
test this out. So I will reload this. Let's give a field color. Then I will another I will add
another one. Let's give field color. Now over here if I change this let's say bring send to back.
See it's going back. If I save this one to send back it will go back. If I want to bring front it
will come front. Perfect. So that's how you have to add bring front and back functionality. Now in
same way you can implement this onlock functionality. Right. So for on lock it has a property

[3:40:39] called lock. Okay. And then you have to provide whether it's a true or false. And based on that it
will lock and unlock for you. Otherwise everything is same. So that's how our all the uh remaining
properties elements property is now working. If you any question any doubt on this one let me know
in the comment section. This is a complete customization and you will not find the customization uh
app like this. And this this app definitely make you lot of money if you add lot of extra feature
because now after this we are going to add a lot of AI related feature where you can draw the
diagrams, mockups, templates and many more. So make sure you subscribe to our channel if you did not
subscribe and now it's

[3:41:24] time to push our code. So we'll simply going to create a new branch. We'll name it as a seven dot.
And then we'll add customize properties floating bar. Then we'll add the commit message as well.
Make sure to stage all of these changes and we'll say commit. Then we'll publish this branch. Once
it published, let's go to the GitHub and then we'll create the pull request out of it. And once the
pull request is created, then you can simply wait for code rabbit to review your code which is very

[3:42:11] important. I always prefer to review with the code rabbit first before merge my pull request which
give me uh the clarity what is wrong or what can we fix it and most important now along with the
review and the review change tag you can run the uh the security on the PR so basically go to the
security start your uh free trial if you are new and then you can just click on the scan repo you
have to select the repo which you want to scan so in our case we'll say our latest project then what
you want to scan whether you want to scan dependency the secret key if there is any or you want to
do AI deep scan now AI deep scan will scan everything for you okay but if you want to try a
dependency or if you

[3:42:57] want to try other things you can even scan that too and then simply click scan now so basically if
you have missing uh secret key or anything which might um be a issue for the security purpose then
this code rabbit security will scan and find it for you. Currently if you see the one scan is
running you just need to wait and then once it's done you will get a proper result if there is any
issue but over here in meantime just wait for code rabbit to review and then you can also review the
change tag and once the code rabbit review your code you will see what are the changes or suggest uh
it suggested right so we have this analysis chain where you can execute the script then you will see
the

[3:43:46] command replace unsupported base UI pop props. Okay. And then if you are using a then you can simply
copy this prompt. But uh I feel I read all of them and I made the changes accordingly. Very small
changes. Um but right now I will just merge this pull request. In meantime if you see over here the
scan is completed and if I click on it you will see the complete detail. So right now the stripe
access token which is a confidence low because we just added but we did not use it right. So that's
why it's saying the confidence level is low. If you click on it it will give you the proper
description where it actually use see over here inside. which is you can just ignore it uh

[3:44:31] because it's just a example but that's how you will get the result but other than that we also have
option like attack surface AI deep scan secret key which we just run the dependency scan and many
others which is recently added by the code rabbit and this is also available to try it out and
definitely uh this is very helpful if you are building some application and want to avoid u the
security problems. Okay, so make sure uh to use and try this code rabbit security feature. Now once
you are happy with all of this code change, simply merge your pull request to the main branch.

