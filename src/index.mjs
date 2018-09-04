import Telegraf from 'telegraf';

function st(str, p1, p2){
    let s = p2 ? p2 : str;
    let r = '';
    for (const c of s) {
        r += c + '\u0336';
    }
    return r;
}

const Bot = new Telegraf(process.env.BOT_TOKEN)
	.use(async (ctx, next) => {
		const start = new Date();
		await next();
		const ms = new Date() - start;
		console.log('Response time %sms', ms);
	})
    .catch(e => console.log(e));
    
Bot.on('inline_query', async ctx => {
    if (ctx.update.inline_query.query === "") {
        return;
    }
    let query = ctx.update.inline_query.query.replace(/(~{1,2})(.+)\1/g, st);
    if (query === ctx.update.inline_query.query) {
        query = st(query);
    }
    const extras = {
        is_personal: true,
        cache_time: 0
    };
    const result = [{
		type: 'article',
		id: 'strikethrough',
		title: 'Strikethrough',
		input_message_content: {
			message_text: query,
			parse_mode: 'Markdown'
		},
		description: query
    }];
    return ctx.answerInlineQuery(result);
});

Bot.startPolling();