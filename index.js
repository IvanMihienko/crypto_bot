require ('dotenv'). config ()
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require("grammy");
const bot = new Bot(process. env. BOT_API_KEY)
const {hydrate} = require ('@grammyjs/hydrate');

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

bot.use(hydrate());

bot.api.setMyCommands ([
    {
        command: 'start', description: 'Запуск бота',
    },
    {
        command: 'hello', description: 'Ну здарова',
    },
    {
        command: 'doom', description: 'Орать',
    },
    {
        command: 'mood', description: 'Настроение',
    },
    {
        command: 'sub', description: 'Статус подписки',
    },
])

// Handle the /start command.
bot.command ('start', async (ctx) => {
    await ctx.reply('Привет! Я - бот.')
    });

bot.command ('mood', async (ctx) => {
    const moodKeyboard = new Keyboard().text('Хорошо').row().text('Норм').row().text('Плохо').resized()
    await ctx.reply('Как настроение?', {
        reply_markup: moodKeyboard
    })
    });

bot.command ('doom', async (ctx) => {
    await ctx.reply('EEEEEEEE')
    });  

bot.command ('hello', async (ctx) => {
    await ctx.reply ('Здарова')
    });


const subKeyboard = new InlineKeyboard().text('Узнать статус подписки', 'subStatus').text('Подписаться на канал', 'subLink');
const backKeyboard = new InlineKeyboard().text('Назад', 'back')

bot.command ('sub', async (ctx) => {
    await ctx.reply('Сначала нужно подписаться на канал', {
        reply_markup: subKeyboard,
    });
    await ctx.answerCallbackQuery();
});

bot.callbackQuery('subStatus', async (ctx) =>{
    await ctx.callbackQuery.message.editText('Статус подписки: Подписан', {
        reply_markup: backKeyboard,
    });
    await ctx.answerCallbackQuery();
});

bot.callbackQuery('back', async (ctx) =>{
    await ctx.callbackQuery.message.editText('Сначала нужно подписаться на канал', {
        reply_markup: subKeyboard,
    });
    await ctx.answerCallbackQuery();
});

bot.callbackQuery('subLink', async (ctx) =>{
    await ctx.callbackQuery.message.editText('Вот ссылка на канал', {
        reply_markup: backKeyboard,
    });
    await ctx.answerCallbackQuery();
});

bot.on ('msg', async (ctx) => {
    console.log(ctx.msg);
})
// Handle other messages.
//bot.on ('message', async (ctx) => {
//    await ctx. reply ('Используй команды')
//    })

bot.catch((err) => {
    const ctx = err.ctx;
    console.error('Error while handling update ${ctx.update.update_id}:');
    const e = err.error;
        if (e instanceof GrammyError) {
            console.error("Error in request:", e.description);
        } else if (e instanceof HttpError) {
            console.error("Could not contact Telegram:", e);
        } else {
            console.error("Unknown error:", e);
        }
});

// Start the bot.
bot.start();