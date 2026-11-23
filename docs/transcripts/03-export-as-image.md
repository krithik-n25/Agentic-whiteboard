# Export as Image

> Auto generated captions. Use this for concepts, order of steps and what the
> author is trying to build. Variable names, spelling and exact syntax may be
> wrong. Write the code in the existing project style, and check library docs
> for current APIs instead of copying anything from here.

## Export as Image
Video range: 4:39:23 to 4:50:00 ([open at start](https://www.youtube.com/watch?v=mXSt_YSlp-U&t=16763s))

[4:39:27] Now we are going to add an export option to this functionality. If user di designer diagram and if
user want to export this as a image we want to give an option. Currently if I click on this menu you
will see this export image option and there are bunch of other option you will find on this menu but
this menu we don't want to use it anymore because this is added by uh Excalidraw by default and we
don't want to use and we we are also going to remove this library section. So in order to do that
simply first open the inspect panel and search the class name for this one. So if you see this is
the class name and which will remove this complete uh app menu top. So I will simply copy that as it
is then actually you just need this

[4:40:15] app menu top then go to your whiteboard dot CSS and inside this we'll simply going to say display
none. And if I refresh it then you will see that top bar is now gone. Now at the header section
let's go to the workspace header and inside this we are going to add one more button and we'll call
it as a export here. Um we'll add an ex let's add a download icon and then if I refresh it you will
see this new option called export. You can change this color or variant however you like.

[4:41:00] I will just remove something like this. So it will show in blue color. Now on the click of export we
just need to download as a image. Right? So either you can add on click method. So we'll say on
click and then we'll say on export. Now this method you need to pass back. Basically you cannot pass
back to the whiteboard. So right now while because we added this workspace header to the page. Okay.
So instead of this what we can do um we'll go to our whiteboard and inside this whiteboard we are
going to return this Excalidraw uh API. So maybe we can

[4:41:52] uh go to this Excalidraw API not API but Excalidraw. And here we are triggering this set actually
draw API. Same time uh we will say on API ready and then we'll pass this API. Now this on API ready
we'll pass back to the parent component. Okay. And we'll give the type props over here. I will
define this prop type and we'll say on API ready and we'll provide a type as a Excalidraw API but
this is a function so maybe we can write something like this API Excalidraw API and type is void now
inside the uh page.tsx tsx because uh our

[4:42:45] whiteboard is let's go to this workspace page.tsx tsx where we have this whiteboard. Now inside this
we have to accept that on API ready obviously which will return the API and this API you have to
set. So we'll say constant then you can simply um set the API. So we'll say set API is equal to use
state and then you can add Excalidraw. Oh, over here we'll say Excalidraw API obviously or null and
then by default we'll set to null. Now whenever we get

[4:43:33] this we'll set the API with the API. Perfect. Now we have this API from the Excalidraw. Right now
from this workspace header we pass already pass oh we have to pass this on export to the parent
component right and here as well I will put a type any and then inside the page tsx now we'll accept
this on export and let me show you whether it's click or not right so we'll say export port. Now if
I save it, let's refresh this screen. Go to the inspect panel and

[4:44:18] inside the console, if I click export, you will see the text export. Perfect. Now we'll create a
method which will handle the export image. So we'll say constant handle export image is equal to
arrow function and then we'll check if there is a no API then it will return nothing otherwise first
we'll get the blob so we'll say blob is equal to await export to blob now this method is from the
Excalidraw make sure you're importing from the Excalidraw and remove that / index and then inside
this we'll Say elements

[4:45:04] equal to API dot get scene element because we want to get all the scenes. Then app state for the app
state we'll say D- API dot get app state and then we'll say export uh export background. So this has
method called export background to true and then after this we need to uh say API dot get files. Now
this particular line of code you will find on the documentation but I already know so I'm just
typing it. So we'll say mime type

[4:45:50] as image/png. If you want to PNG, if you want a JPEG JPEG, you can add that too. And then we'll say
quality, we want one, which is a maximum quality. As we are using await, I will mark this as a sync.
Now, after this, we'll say constant. Now, it's time to download it, right? So, we'll say URL dot
create object URL and then pass the blob which you just uh created. And in order to download we'll
say constant link is equal to document dot create element with the anchor tag. And then we'll say
link dot h reference is equal to URL. Then we'll say link dot download is equal to

[4:46:40] whiteboard.png. And then we'll say link dot click. Okay. So this is the way to download it. After
that after once it is download we'll say revoke object URL and pass that URL and save it. Now this
handle export image we need to call when user click on export method and save it. Now let's add some
uh images. You can change the color if you want. And when you click export, uh it should export into
an image. Let's refresh it. I think we did not refresh. So I will add some color, some value.

[4:47:26] And then we'll say export. And right now if you see it exported into a PNG and if I open this,
you'll see the result. Perfect. Right? So that's how easily you can export um your generated or
added whiteboard. Now obviously you can add image text and everything will get exported as you saw
on the whiteboard. Now let's push whatever the code we changes we made to the GitHub so that code
rabbit can review our code. So we'll go to the source control. Uh we'll create a new branch first.
So we'll say create branch. Then we'll say AI sidebar with AI model and export image

[4:48:13] or we'll say export whiteboard to image. Then we stage all of the uh we'll add a commit message as
well. We stage all of these changes. Say commit and then make sure to publish your branch. After
that, simply go to your GitHub account and then make sure to create the pull request. Once the pull
request is created, then just wait for a code rabbit to review your code. As you know that you can
run the deep scan for the security with the help of code rabbit security feature where you can find
all the uh issue related to the security and then it will do the uh secret scanning AI deep scan
dependency scan attack

[4:48:59] surface and many other and you can simply get access to this code rabbit security for a free the
free trial you can simply join it also all the AI per Box user will get a code rabbit free pro plan
for the first 100 user only. This offer is valid until 24th of August. So make sure to join this
code rabbit pro plan completely for free. AI poxbox provide more than millions of um AI perks for
you. Make sure to join it and then you will also get this code rabbit for a free. Now once the code
rabbit review our changes you can see uh everything in detail with the proper inline command

[4:49:44] what is the um the how important it is to fix it right. So for example this is a minor change but
this is similar way you will see all the inline comments and once you are happy with it simply merge
your pull request to main branch.

