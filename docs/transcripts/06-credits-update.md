# Credits Update

> Auto generated captions. Use this for concepts, order of steps and what the
> author is trying to build. Variable names, spelling and exact syntax may be
> wrong. Write the code in the existing project style, and check library docs
> for current APIs instead of copying anything from here.

## Credits Update
Video range: 5:39:02 to 5:48:49 ([open at start](https://www.youtube.com/watch?v=mXSt_YSlp-U&t=20342s))

[5:39:02] complete code. Here I implemented this archived page where it will show the soft deleted files. For
example, if I delete this particular project, if you see it moved to the archive and then you will
see you have option to delete it completely or you can restore it back and then it will come back
again. Okay. Now in this particular chapter we will mainly focus on limiting user for the certain u
file create or whiteboard create. Currently for a free user we are only allowing to create total
three whiteboard and if user exceed that then it will show error or something like that and we also
making sure while creating a new whiteboard project first it will check

[5:39:47] whether user has valid credit or not because inside the database under the user we are checking or
we have this credit column and whenever user create a new uh white bub project then we have to make
sure to deduct that credit as well. So for that one, let's go to the project API. So we go to this
API inside that we have project and then here we'll check user credit is greater than zero or not.
Right? So for that one we'll say constant user credits is equal to await db dot select and then we
have to use a users table. So make sure to use this users table. Then we'll say oh maybe actually we
need

[5:40:36] to add it from users. Then we'll say where and then we need to add a condition. So inside that we'll
say user dot um so user dot email matches with the current user email. So we'll say user dot primary
email address dot email address and that's how you'll get the user credit. Now we'll check if user
credits is greater than zero or we'll say if user credit is less than equal to zero then we'll
return next response dot JSON and inside that we'll say message

[5:41:24] I will just say error insufficient credits Okay. And obviously uh here make sure this a list. So
we'll say first element dot credits. If it's less than equal to zero then we are not showing. Right
now we are getting error. It's saying is possibly null. So we can add a condition as well. Now if
obviously credit is greater than zero then we are good. But as soon as user create a new project we
have to deduct it. It means we have to update the credit information. So we'll say constant update
user credits is equal to await db dot update give the table name.

[5:42:12] So we'll say users dot set and then we have to set the credit value. So we'll say credits and then
we have to make sure this particular credits minus one minus one. Okay. Here we'll say it's a number
and once this is done we have to also add a condition. So this this is the same condition we need to
add because we need to make sure we are only updating for that particular user and then once we get
the updated user credits then we are good to go and then save it as simple as that right and that's
how you can update the credits. Now if I go back and let's try now currently we have to

[5:42:57] make sure it will show a proper credit. This is just a placeholder. So I will go to the sidebar
which is an app sidebar and over here if you remember we are just hardcoded this value. Now we
already have the context and from that context we are going to get a user detail. So you have to use
curly braces when you are fetching or getting the data from the context. And here we will say set
user detail is equal to use context. And inside that you have to say user detail context. Now from
the user detail you will get the credit information. So here you will say user detail dot credits.
And now you will see a total credits which is three file created total three. So basically here we
need

[5:43:46] to make sure total minus three. So I will add something like this total credits and I will define
this constant at the top. Now for example for a paid user if you want to change this obviously you
can change it but right now total credits or total max we'll say max credits and then from here
we'll say total max credit minus this one. So over here it's it will say zero file credit total
three currently we have three credits to this user. Let's say it's two credit only and if I refresh
it now it will say one file created total three or you can say one file created

[5:44:38] and total you can give any message you want okay that's completely up to you and in the same way you
have to update the progress bar value so basically I will just add this value whatever the value it
left divided by total Max credit into 100 into 100. Now if I refresh it. Okay. So the logic is
incorrect. Oh, over here make sure you will wrap or you have you have to wrap it like this and then
you will see it's showing one file created and then progress bar. Perfect. Now whenever you create a
new board let's say you created a workspace two and click create. Now once it

[5:45:27] created you jump onto the new board but over here if I refresh the credit is now changed to one. Not
only that but if I go back to our homepage and let me refresh this once. So over here you will see
two file created. Okay. Now next um if I go back where we are showing that insufficient credits
right in that case or here you can also add status or not status but let's say this one only and
when you create uh when you call this API endpoint and when the error message comes it then in that
case we have to make sure you'll not navigate it. So we have to add logic

[5:46:12] for that. So we'll go to the dashboard. Inside the page we have the project list. Basically inside
the create new dialogue we have the logic return. Right? So over here we'll check if result dot data
dot error. Then we'll return nothing. And here we'll add a toast message with the error. We'll say
insufficient credit. and save it. And if you want to test this, let's test this out. So we'll say
workspace 3. Now obviously I have three workspace created, right? And if I refresh, you will see now
we don't have capacity to create again. If I try to

[5:47:00] create a workspace four, click create. Oh, it's still created. That's interesting. So somewhere our
logic is not working. So right now if you see the credit is minus one. So in if I go to the
route.ts. So I think the condition somewhere is not correct. Okay. The problem whole problem over
here is this one. Okay. We have to replace this with the condition like number credits of zero and
it will check the value. Okay. Now if I test this and I am for the testing I'm just making this as a
zero

[5:47:47] and let's refresh this one as well like create a new board workspace five click create and now if
you see it's not allowing me to create it perfect and that's what we want only small change I'm
going to do is inside our create new board whenever there is a error I will just top and we'll set
the loading false and save it. Okay. So that's how uh you have to implement and restrict user from
creating u extra uh whiteboard if user is a free trialer. Now next uh you can try adding a payment
gateway. There are lot of different way that you can add the payment gateway. In my previous video I
added payment gateway in lot of different projects. You can take a reference of that one.

[5:48:34] Also uh the deployment part is very straightforward. I will show you in the next chapter. But before
that, if you really want to convert this into a SAS, then you should add the payment gateway to your
SAS application.

