# sapling - our (custom) tele bot for team
yeah! to be more productive and all

## setup your own (draft)
here's a quick guide/explanation about sapling. sapling mainly consists of 2 parts, the github push notifs and the todo list (more functions upcoming). to setup your own thing, you'll need to create your own bot in telegram with botfather

### send messages to your chat when someone commits!!
we have a web service running so that when someone pushes their commits in our repo, it will show up in the chat!! here's a simple guide on setting it up.

you'll need a few things: a telegram bot, somewhere to host it and a github repo

1. to start, go ahead and find the script in `commit/main.py`, to host it, you'll need to setup a repo with it, alongside `requirements.txt`. 

2. then, you'll need to make an `.env` file. remember to setup a `.gitignore` so no one knows your tokens! here's what you'll need:

```
BOT_TOKEN=your-telegram-bot-token
CHAT_ID=id-of-your-group-chat
```

you can get your chat id in the url of your group chat. you can also modify the code so it sends everywhere, but here I try to keep it simple

3. host it as a web service. I used render because it is free

4. create a webhook at the repo you want to broadcast the message from. in the payload section, put the url of the 'api' you've hosted it on. (eg, `sapling.onrender.com/push`)

### sapling main bot!
this is rather more specific, so I'd reckon its not the best bot to be used. though feel free to use the script as a template and add more commands on top of it. the bot uses telegraf, so that's where you should find the docs.

we're not going to go too deep here, but here's what you gotta need to run it:
1. setup a database: I used supabase, make a table (the one in the code is called junggle-list) with four columns (id, todo_info, status, created_at), with 2 of em' are defaults and todo_info is text while status is a boolean. You'll need to add a policy so anon users can read, write, delete, etc. then, if you used different names, make sure to edit/replace them in `index.js`

2. make a `.env` file, with all info like below

```
BOT_TOKEN=your-bot-token
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

3. host it as a background worker, i've used railway because its free. you're going to run `index.js`

## do it together
yeah, if you wanna have it in the same repo, you can host em too. here's a main `.env`, as it is definitely easier

```
BOT_TOKEN=
CHAT_ID=
SUPABASE_URL=
SUPABASE_KEY=
```