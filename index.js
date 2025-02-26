const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply('yellow i\'m sapling!!'))
bot.help((ctx) =>
    ctx.reply('/todo - list all todos\n/add - add a todo\n/done - mark a todo as done\n/toggle - interact or undone a todo\n/remove - delete a todo')
)

bot.command('todo', async (ctx) => {
    const { data: todos } = await supabase.from('junggle-list').select('*').eq('status', false)

    if (todos.length === 0) {
        await ctx.reply('Yay! No more todos')
    } else {
        await ctx.reply('Todo list:')
        for (const todo of todos) {
            await ctx.reply(`${todo.id}. ${todo.todo_info}`)
        }
    }
})

bot.command('add', async (ctx) => {
    const job = ctx.message.text.replace('/add', '').trim()

    if (!job) {
        await ctx.reply('Please provide a todo item')
    } else {
        const { error } = await supabase
            .from('junggle-list')
            .insert([{
                todo_info: job,
                status: false
            }])

        if (error) throw error;
        await ctx.reply(`Added: ${job} to the list`)
    }
})

bot.command('done', async (ctx) => {
    const id = ctx.message.text.replace('/done', '').trim()
    const todoStat = await supabase.from('junggle-list').select('status').eq('id', id)

    if (!id) {
        await ctx.reply('Please provide an id')
    } else if (todoStat) {
        await ctx.reply(`Todo item already marked as done.`)
    } else {
        const { error } = await supabase
            .from('junggle-list')
            .update({ status: true })
            .eq('id', id)

        if (error) throw error;
        await ctx.reply(`Marked as done: ${id}`)
    }
})

bot.command('toggle', async (ctx) => {
    const id = ctx.message.text.replace('/toggle', '').trim()

    if (!id) {
        return await ctx.reply('Please provide an id')
    }

    const { data: todo, error: selectError } = await supabase
        .from('junggle-list')
        .select('status')
        .eq('id', id)
        .single()

    if (selectError) throw selectError
    if (!todo) return await ctx.reply('Todo item not found')

    const { error: updateError } = await supabase
        .from('junggle-list')
        .update({ status: !todo.status })
        .eq('id', id)

    if (updateError) throw updateError
    await ctx.reply(`Toggled: ${id}`)
})

bot.command('remove', async (ctx) => {
    const id = ctx.message.text.replace('/remove', '').trim()

    if (!id) {
        await ctx.reply('Please provide an id')
    } else {
        const { error } = await supabase
            .from('junggle-list')
            .delete()
            .eq('id', id)

        if (error) throw error;
        await ctx.reply(`Removed: ${id}`)
    }
})

bot.hears('meow', async (ctx) => {
    await ctx.reply("meow");
});

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))