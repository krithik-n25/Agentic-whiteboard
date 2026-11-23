# Display Project List

> Auto generated captions. Use this for concepts, order of steps and what the
> author is trying to build. Variable names, spelling and exact syntax may be
> wrong. Write the code in the existing project style, and check library docs
> for current APIs instead of copying anything from here.

## Display Project List
Video range: 5:06:47 to 5:39:02 ([open at start](https://www.youtube.com/watch?v=mXSt_YSlp-U&t=18407s))

[5:06:51] If you remember when we implement the dashboard page we implemented until empty state. So basically
when user create a new board it still show empty because we did not added any logic to get all the
project list and to render it. Also for this project list if you see we have the preview of the
whiteboard which we want to show at the top and then uh the project name and other information. Now
in order to get this or generate this preview we want to save the workspace uh screenshot you can
say. So basically uh we need to take out the screenshot of this particular page and then we want to
save. If you remember we imported uh we added this option called

[5:07:37] export right now same way we have to implement but instead of saving it inside your local we will
convert this into a base 64 and then we'll save it to our database as simple as that. Now this will
happen whenever we are updating or saving the whiteboard to the database same time we'll also take a
screenshot and save to our database. So to implement it, I already have this uh snippet ready for
it. So basically this will help us to generate the preview base 64 and then we'll convert blob to
the base 64 and then uh whatever the result we'll get we'll just use it to save. Now let's copy that
as it is. I

[5:08:22] will close all of this tab for now. And then inside our whiteboard that's where we have this set
canvas uh change save canvas changes right maybe uh you can add anywhere but let's add after this
make sure you will remove this string and then over here uh replace your API with the our own API
Okay. So, Excalidraw API this is just a code uh which I wrote but you can make sure to update
according to your requirements. Now over here obviously we need to call export to Bob method that
we'll I will

[5:09:12] show you. So if I do the control space if you see we have this method and this method if I go at the
top it will get added. So I don't know where it get added Excel to blob. over here. Okay, perfect.
And after this we have to implement blob to base 4 that also code is available inside these
documents which will basically convert to a block to base 64 code because instead of storing the
complete image we'll store the base 64 image and this will just return that. Now this generate
preview base 64 you

[5:09:58] can call inside the you can either call it to the save canvas changes or you can call inside u the
handle canvas change. So let's call it inside the save canvas change and here we'll simply say
constant base 64 image preview is equal to and we'll call this method. Now make sure to add it as a
and then save it. Now this B64 image we need to pass to this whiteboard as it is. Then under the
API/ whiteboard we have to accept this new parameter. So we'll go to this API and then under the
whiteboard I will accept that and then inside this

[5:10:46] whiteboard data we need to save it. If I go to the whiteboard data, obviously we need to add this
new file. So we'll say preview image of type text and again I will give the name preview image. Now
this is a new column we added. It means we have to make sure to update our database. Okay. So I will
run the push command. So npm run db push and then it will push that new changes. See? And then you
can run the studio verify that this new column is now ready. And if I scroll to the right or inside
this whiteboard data, you will see this preview image. Currently, it's null

[5:11:31] because for the old one, it's not we don't have data. But now the preview image ready. So you that
you can simply add the value. Over here we'll also add preview image and then save it. And now if
you see for this one it just now saved. I also reload it. If I go over here you will see this
preview image with a base 64. Perfect. Right now in order to save lowquality data right make sure
you don't uh you are not saving the high quality preview image right otherwise it takes a lot of
space. So that I just give the width and height to 400 to 225 and quality which is 50% only. You can

[5:12:20] decrease this quality if you want and that's how we have to save the preview URL. Now after that um
now we want to display the project list on this particular uh dashboard page. So for that one we
need to go to the projects. Under the project we have route.ts file and inside this we already have
the get request but whenever the project id is one then we are fetching only project information for
that particular project. But if user did not provide the project ID in that time we are going to
fetch all the projects uh for that particular user. Okay. So we already have this if project ID is
not

[5:13:07] there we are just saying that project information is missing but now instead of that we'll just say
and and here we'll add a condition and and if user is there the user information is there it means
user is trying to fetch all the projects on the dashboard so that's why we need this so over here we
say constant project list is equal to await db dot select from projects and then uh after this we'll
add a where condition where equal to projects dot not project but obviously we need to

[5:13:54] fetch with the user. So we'll say project dot username user email and then we'll compare with the
user email dot email address. Perfect. And now we have the project list. Right? So that project list
you just need to return it. So we'll say return next response dot JSON and then we'll say project
list. Over here we are getting error. So I think we can add one more condition over. If there is no
project ID and add no user then return empty

[5:14:45] or you can return some error but still we have okay let's let me remove this because we already have
uh added this condition. Now this will this is the condition it's giving us an error. So maybe what
we can do over here we can add a condition if no project ID then we'll return nothing or you can
just simply add no project ID found and save it. Now after this I will close all of the tab then go
to the dashboard page.tsx file and inside the project list we want to

[5:15:36] fetch. So we'll say constant get project list. Then we'll say constant result is equal to await
axios dot get / ai/ projects and that's all. Here we are using aait. I will mark this as a async and
then we'll simply console log the result. Then then this get project list we need to call inside the
use effect only once. So we'll simply add empty string call this get project list and then save it.
Now if I go back inside the inspect panel go to the console and make sure we are getting the project
list.

[5:16:23] So right now let's refresh this screen. And now if you see we got the project list. Perfect. Now
inside this project list if you see we don't have uh the information related to the or we don't have
the preview image or anything right I think most most important we need is the preview image and
which is missing so we need to get that one as well now inside this uh result if you see we got the
data right but there are a couple of parameters is missing which is the preview image or even the
created add a uh field right so in order to fetch that information right we need to join these two
table together

[5:17:10] because it's already connected with our project ID reference so in order to do that simply go to the
project list inside the route tss where we are fetching uh the project list now inside this first we
need to provide which different column you want to get it so here we'll say ID then we'll say
project dot id. Now you have to mention all the columns which you needed. So we'll say projects dot
project id then the project name. So I will add all the column which I need something like this.
Okay. Now inside this if you carefully observe I also fetching the field from or column from the
whiteboard data using this whiteboard data table. But you have to

[5:17:58] make sure you will join that. So over here we'll add dot left join because we want all the data from
the project and which are the information is available on the right table and then over here we'll
say whiteboard data and then you can add oh over here we can keep this where but here we need to
mention on which field you want to apply this condition. So we'll say equal project dot project id
and matches with the whiteboard data dot project id and then save it [snorts] and that's how you
have to get uh the

[5:18:45] project list with all the field which we needed. Now if I refresh it and if I expand this value now
you will see the preview image along with the updated ad fill. Perfect. Now we have the all the
data. Let's render uh all the projects. Now I will go to the project list here. Once we have the
result, we'll set the project list with the result dot data. And now inside this project list, we
are going to render it. So we'll add a div. We already have div. So we'll add a project list dot
map.

[5:19:34] Then we'll say project, index arrow function. Now at the top I'm going to show an image with a
source here we'll say project dot um preview image. Then inside the tag you can give the project dot
project name and then width and column. So over here we'll say width let's say 200 height 1450. I
think that's all. But right now

[5:20:20] we are getting error because the project don't have proper type. Now let's define a type for that
project. So we'll say type project. Then we'll say project name of type string. Then ID of type
number. Then we have project ID of type string. Then preview image which is of type string. Then
what else we have? We can just refer from the column. Uh the user email is there. Then we have field
called updated add because I think we changed this value. See and I think that's all we have. Right?
If you want to save the user email or

[5:21:08] you can save that too. And then this type you have to attach to it. And here for the index I will
pass type number. Now for this div we'll add a key as index. Perfect. Let's save this. Let's go
ahead and verify at least it's rendering the data. But right now okay now we have the project list.
And if you see it's showing this preview, right? Obviously we have to add some styling and all of
that data. So first let add a class name. We'll add a border with a rounded to let's say large. Then
we'll add a div.

[5:21:57] Inside the do we'll add a title of project name. So we'll say project dot project name then when
it's edited. So that time you can add. So we'll say project edited. So we'll add in text edited and
then project dot updated add something like this. Obviously we need to change this format. So for a
date to change the date format we'll use one very popular library called npmi moment. So make sure
to install this

[5:22:45] moment library. This moment library basically uh convert your date into an ed format. So if I go to
the moment just type moment just and you'll find this library. See you can just install by npmi
moment and if you see you can convert this into different different format. So once you install it
now once you added this moment library make sure to import this moment library like this and then
you can simply wrap your date inside this moment. Then we'll say from now you can convert into any
format but if I write from now then it will give you the time when you updated. So something like
this. See it's saying edited 9 minute ago. Obviously we need

[5:23:34] to add u add styling. So for this one, we'll add font medium text. I will say smaller. I think it's
I think let's keep it like this. And for this P tag, we'll say text excess. Then text gray color and
save it. Perfect. Then we'll add some padding. And for this div I will make it grid grid column 2
for a small screen. For a medium screen we'll say grid column 3. And for large we'll say grid column
4 with a gap of five. And also we'll give margin top to 10.

[5:24:21] So uh maybe let's wrap this inside another div because I want to add proper label to it. I don't
know whether we add extra do what just add this curly braces outside and then over here we'll add H2
tag we'll say your boards let's add a class name font bold text to Excel and then P tag will say
create

[5:25:10] organize and continue working on your ideas. And to this one we'll say class name text gray color
let's say 400. And now you can say margin top to 10. over here you don't need to give margin top to
10 let's say three only or two something like this three if I close you will see your board now
let's uh do one thing now in order to improve your image and all what you can do you can simply copy
this div then go to the AI because we don't want to spend lot of time designing this small

[5:25:58] UI and paste it here and we'll Okay. Improve my card design and also add um popover or just we'll
say also add delete button to right bottom side for each car. and then hit enter. Now obviously uh
you can ask to any chart GP or anything like that and simply you'll get a proper result. Now make
sure to copy this due as it is.

[5:26:49] I don't know why it's not getting copy quickly. Oh that's weird. And then I'm going to paste it
here. Just make sure those import statement. You can move that on the top. And over here we need to
add a handle delete project. Right now we'll just comment this out and make sure to import this
trash icon. Now once that is done, see your board is now ready with that particular image. Perfect.
And then we have workspace when it's edited and you also have option to delete this. Now on the
click of delete basically you can do the soft delete. Okay. Now soft delete means uh you don't need
to delete

[5:27:38] completely and whenever you do the soft delete it will just save it under the archived folder. Now
make sure when you click on it it will navigate to that proper u folder. Okay. So either you can
wrap this inside the link or you can just change this to a link. I believe that also work. Make sure
there's no change. And then to this link you have to provide h reference / workspace/ project id. So
we say project dot project id. And also for this inside this class name you can say hover.

[5:28:23] Whenever user hover on this you can change the cursor pointer. Save it. Go back. Refresh your
screen. Then if you click on it it will navigate to that page. And if you see your image is still
there. Now if I color this one and I will also color up. I will also color this one as well and it
after 10 second it will automatically get saved also it generate the proper preview image which you
will see on the dashboard once you reload it. Now I will go back to the workspace and boom if you
don't want this zoom because right now I think we added the project

[5:29:08] cover. So over here we'll say project content. Let's see how it looks. I think this is how it looks
uh when you do the content. Let's make it cover only. And if you want you can change this size or I
will just make this grid column three only little bit bigger. Let's make it smaller. That's fine.
Okay. Um if you want you can add a border bottom to this image. So we'll just say border bottom. And
I think this is much better. So that's how you have to u add the project or display the project list
on your dashboard. Now let's add a delete

[5:29:53] functionality as well. Now for the soft delete right on the click of delete uh we'll just delete it
and it will go to the archive. So I will create a new method because we already comment this out. So
I will copy the same method name and then over here we'll say constant handle delete project and
inside that we just need to uh make an API call. So inside the project route I will create a new
method called export. So this is the get okay so let's say async function then this will be the
delete request and then we'll say next request.

[5:30:41] Now inside that we need to get the project ID. So we'll say project id is equal to aait request dot
json and then we just going to update that particular projects right so we'll say constant result is
equal to await db dot update and then you have to provide the table name so we'll say project then
we'll say set and over here we need to add a column under the uh projects. So over here we'll say is
deleted then it's of type let's say

[5:31:30] a boolean and then we we'll name mean a column name as a is deleted only but default we'll say
false. Okay, now you made the changes. So basically I'm going to update our database with this new
changes in a project column and then once the changes is reflected you can simply set the is deleted
to true. Okay so this is basically a soft delete. Okay we are not really deleting. Now once you said
that you can return it next response dot JSON and you can say a message as deleted.

[5:32:23] Now the thing is uh we have to make sure to delete only that particular record. So we have to add
where clause then project dot project id and then whatever the project ID you pass and save it. Now
whenever you get the project list you have to make sure that the project uh that is deleted is uh
not true. Okay if is true then don't show it. Then obviously over here we need to add one more
condition. So we'll say add. Then we'll add first equal condition and then second condition will be
to check is deleted is true or not. So we'll say equal to project dot is deleted

[5:33:15] equal to false then only fetch that records and let's wrap it here and save it. So once you have the
API endpoint updated inside the handle delete project we say constant result is equal to await exos
dot delete / API/ projects and inside the body we'll make sure to pass the project ID as project ID.
So I don't know whether okay. So we have to make sure to get the project ID

[5:34:03] and then pass this project ID here. I will mark this as a sync. So we are getting error because I
think we have to pass inside the data when you are deleting it. Now once uh we get the results over
here we'll also do the toast dot add here we'll set type as success and title as move project to
archived and then save it. And after that we have to make sure you will call this get

[5:34:48] project list. Okay, with obviously it will get the updated data and set the project list initially
as empty and then this handle delete project we have to call over here. So I will just unccomment
this and save it. Perfect. Now obviously we did not add any warning or anything but you can
definitely add if you want. And now if I click delete, see it's get deleted. Oh, I think it's also
get clicked. But basically on this one now it's it's not there. Now obviously we don't make we have
to make sure it will not redirect it to the on the click. So I will move this link. So first I will
replace this to the div

[5:35:33] as before and I will change this to a do as well. And I will make sure this link only applicable.
For example, let's say to this one. So we'll add a link and then I will close it here. Perfect. If
you want you can add two other elements. But right now it's completely archived. And if I go back to
the projects, let me refresh so that you will see that updated column is deleted to true. Now if I
make this false, save the change and then refresh your

[5:36:18] dashboard, you will see that result. Perfect. Right? Uh somehow the preview image is gone. So if I
open that, so it's not opening. Let's see why the preview image is gone. Oh, it's maybe because of
this link. Let me change this to a div. And I will just remove it. And now it's showing. Okay, let's
do one thing. Instead of this do, we'll just uh navigate it on the click of image or something else.
So basically, we can add on click method and then we'll navigate it programmatically. So in order to
navigate programmatically

[5:37:03] you can simply need to add constant router is equal to use router. Make sure you are importing from
the next /navigation and then you can simply add router dot push and then we'll say slashworkspace
slash project dot project id. And now I can go to that particular project. See and I can go back if
I want I can delete it. So that's how uh the delete functionality work. If you have any question any
doubt let me know in the comment section. Now this is a task for you. You have to implement this
archive similar like this one. You can

[5:37:48] reuse this component but instead of is deleted to false we have to uh show the list which is where
we mention is deleted to true. and then it will show all the soft deleted project and in there you
can add an option to retrive them back. Now once you made all of these change I will just uh create
a new branch then we'll say our display project on dashboard hit enter then we'll give the commit
message and then simply say commit and then publish the branch after that we'll go to the

[5:38:34] GitHub and then make sure to create a new pull request and then you have to simply wait for a code
rabbit to review the changes. Now as you know that you can do the deep scanning with the code
rabbit. You can use a review change tag to verify what are the changes you made with a line by line
explanation and then you can also wait for code rabbit to review your

