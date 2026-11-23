# Fetch Whiteboard Data

> Auto generated captions. Use this for concepts, order of steps and what the
> author is trying to build. Variable names, spelling and exact syntax may be
> wrong. Write the code in the existing project style, and check library docs
> for current APIs instead of copying anything from here.

## Fetch Whiteboard Data
Video range: 4:51:54 to 5:06:47 ([open at start](https://www.youtube.com/watch?v=mXSt_YSlp-U&t=17514s))

[4:51:54] the database. Now whichever data or whiteboard elements we saved to our database we have to make
sure we will retrive that and we'll display it every time when we load the project and this is very
important right so currently if you see just now we added the element and it get saved but when I
refresh it it will get uh removed right so if I refresh the data is not there because we are not
loading the updated data so let's fix this so obviously um we need to add a new API endpoint. So
we'll go to the API under the project we have this route and inside that we have the post request.
Now over here we also going to add the get request. So we'll say export a sync function and then
we'll add a get

[4:52:45] here. We'll say request of type next request. Now inside that you need to provide the project ID. So
we say constant project id and then we'll say await request dot json. After this make sure our
project structure. So if I go to the database over here we'll first make sure this project ID is
belong to that particular user and we already saving the user email and then only we'll allow uh to
view that change. Okay. Otherwise anyone will see your [snorts] project. So here we'll say first
we'll get the user information is equal to await current user and then once you have the

[4:53:34] user information here I will add if no project id then return empty not return empty but we just
need to return um some response. So I will just copy the similarly response. Then here we'll say
constant uh uh we can just say user project is equal to await db dot select dot from and then we
have the projects as a table. So we'll say project where and then add a condition. So we'll say
equal to project ID or project ID but project dot ID matches with the project ID

[4:54:27] and and obviously we want to add one more condition. So we'll say and with comma again make sure
it's inside and and then we'll say another equal to with a project dot not projects just say
projects dot user email matches with the user dot primal email address dot email address. Now over
here make sure to import this and operator and I think we need one more curly braces. Yeah. then we
have to add equal to operator as well and over here I will say empty string to avoid the error. Now
over here if you get the result so if there is a no user project or just we'll say user project

[4:55:16] dotlength is equal to equal to zero then we can simply say this unauthorized user or we'll say
unauthorized user that's fine right otherwise it means user has that project belong to that
particular user then we are going to fetch the data So we'll say constant result is equal to await
db dot select from and then we have the table called whiteboard data and then we'll add a where
condition where equal to

[4:56:01] whiteboard data dot project ID matches with this project ID. and which will fetch all the
information and then in the return we'll say next response dot JSON and then we'll just pass the
result of zero. Okay, as simple as that. Now we have the get request and we are also checking the uh
security purpose that that particular project is belong to that user and if yes then it will return
the correct result. Now let's go to the whiteboard. Uh you can go to the page.tsx file and that's
where we are going to fetch. So inside the white space project id.page.tsx

[4:56:48] file. Here I'm going to create a new method. We'll say constant get whiteboard data arrow function.
Here we'll say constant result is equal to await axios.getate. We'll say / API slash uh post sorry
not post u the API endpoint is call whiteboard only not whiteboard it's just projects and then uh we
need to pass the body so over here uh we cannot get there is request JSON because this is a get
request so you have to change this so maybe over here we can write constant search params is equal
to request dot

[4:57:38] next URL dot search params and then you can get the project ID is equal to search param dot get and
then provide the um project we'll say project ID okay now same project ID you have to pass it as a
query parameter letter. So something like this and here we'll just get the project ID. Now project
ID you already have over here. So we get that. So we'll say project ID is equal to use params and
then this project ID we'll pass. Here we are using await. So I will mark this as a sync. And then
once we have

[4:58:28] the result we'll just console the result for now. Then the this get whiteboard data we need to call
inside the use effect. Now this use effect will execute whenever the project ID is there or change
and then only we are going to call this get whiteboard data. So I will add that condition too and
then save it inside the route.ts. Uh it look like we have one small error. So over here project id
will add empty string as as well. So right now let's do one thing. Let's ignore this error for now
and save it. Now if I go back to our application, I will also open the inspect panel

[4:59:17] to verify that we are getting the data. So go to the console and let's refresh the screen and once
it reload right now you see uh so we are getting this error 500. So let's see why. So in this case
whenever you get an API error you you can always check the uh VS code console where application is
running and right now it's saying invalid input syntax type. Okay. Uh integer uh that's weird. So it
means whichever error is giving is correct. So we have to fix this. So over here this need to be a
project ID not the ID. Okay. So this need to be project

[5:00:05] dot project ID. So let's test this again. Let refresh it. And now hopefully I get we'll get the
result. And if you see now we got the result. Perfect. app state elements and file obviously we
don't have anything in but if I add some element something like this right and after 10 second it
will get saved and then we'll reload our application in meantime you can go to the whiteboard data
and refresh it and make sure it is up to date now after 10 second once is done I will refresh it and
then we'll check the result Now, okay, now it's still showing the elements as empty.

[5:00:54] So, let me add element and let me wait for a 10 second. Right now, if you see, we have the elements
saved properly. And now if I refresh it, you might see the result inside the console. Now, over here
if you see now we have two element file and app state. Perfect. Now once you have this data we have
to uh get we have to apply to the canvas. So basically you can pass this data directly to this
whiteboard. So because you can even apply directly from here because we already have this API. Now
once we have the result we are going to update over here. Um we are also making sure

[5:01:41] whenever the API is available then only we are going to make sure to call this get whiteboard data
and then inside this we are going to simply say AI a sorry API dot update uh scene and inside this
scene we'll just simply go and add elements result dot data dot elements because that's what we we
have right otherwise empty and then app state for the app state we'll say normalize app state result
dot data dot app state we already saving these elements and app stata as well

[5:02:28] after this we also have the files so we'll say result dot data dot files if it's there then we'll
say api dot add files and And in that uh we have to add object values. So we'll say object dot
values result dot data dot files. As simple as that. And at the end you just need to close it. You
don't need to add this one. I think we have extra catch. and make sure to wrap this inside the try
catch. Okay, in case there is any error. Let's save it

[5:03:13] and let's refresh it. So I already have this saved. So if I refresh it and boom, if you see we got
the same data. Now for example, if I color this one and let's say wait for the 10 second and now
it's saying changes saved. Now if I reload it, hopefully we'll get the updated one. See now your
data or information is now persist and even though if you add any AI diagrams any emoji icon nodes
everything will get saved automatically and it will fetch it when you uh reload whenever you want.
Now we also have the hardcoded value uh inside the header called workspace name and in place of that
as we decided

[5:04:00] previously we want to show an actual project name. Now inside our project route we are already
fetching um the user project right and from the user project you can get the um the name of that
particular one. So over here we'll say dot dot dot result of zero comma and then we'll say project
name and we also going to pass a user project of zero because obviously it will return only one
information dot project name. Once we have this project name, you can go to the workspace page.tsx
file and once we get the result, you can save the project name. So we create a state called project
name, comma set project

[5:04:48] name is equal to use state and then over here we'll simply going to or maybe at the top we'll say
set project name will be the result dot data dot project name and then this project name you can
pass to the header. So we'll say project name is equal to project name and then go to the workspace
header make sure to accept the project name I will send I will add a type string and then instead of
this hard-coded value you can replace this with a project name. Now if I refresh it you will see the
actual name of that virtual project. So right now if you see

[5:05:33] it's showing it as a workspace for you and uh if you want you can go back. Now you already have the
created u board and all but it's time to uh display it on the screen. That's what we are going to
see next. But before that let's push our code so that we can review this with a code rabbit. So
first we'll create a new branch and we'll name it as retrive board saved data. Then make sure to hit
enter. So it will create a new branch. We'll get check out automatically. Then give the proper
commit message. You have to stage all of this change. Give say commit and then

[5:06:20] publish your branch. Then go to the GitHub and inside that you'll get an option to create the pull
request. Simply create the pull request and then you can wait for a code rabbit to review your code.
Obviously this is a small change just to retry it. Okay, there's no uh big changes but still we
updated our API endpoint. So it's always good to review this with a code rabbit.

