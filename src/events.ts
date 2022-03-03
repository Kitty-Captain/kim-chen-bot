import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

// Database
import { scores } from './db';

import * as stickersIds from './stickersIds';

const eventChances = {
    mayorPenalty: 0.05,
}

export const randomEvent = (ctx: Context<Update>) => {
    const mayorChanceValue = Math.random();

    if (mayorChanceValue < eventChances.mayorPenalty) {
        ctx.reply('До вас завітав представник КНДР по контролю якості мемів Зубенко Михайло Петрович');
        ctx.replyWithSticker(stickersIds.mayorPortrait);
        ctx.reply('Зараз він проведе аналіз матеріалів і вирішить вашу долю...');

        setTimeout(() => {
            const updateDocs = (rating: number) => {
                const filter = { tg_chat_id: ctx.message.chat.id };
                const update = {
                    $inc: { social_credits_score: rating },
                    $set: {
                        tg_username: ctx.message.from.username,
                        tg_chat_id: ctx.chat.id,
                    },
                };

                scores.updateMany(filter, update);
            }
            const isAngry = Math.random() > 0.5;
            let ratingChange = 0;
            
            if (isAngry) {
                if (Math.random() < 0.99) {
                    ctx.reply('Після побаченого Михайло Петрович розізлився. Він дістав книгу штрафів і виписав кожному карточку на -10 соціальних кредитів.')
                    ratingChange = -10;
                } else {
                    ctx.reply('Михайло Петрович ніколи ще не був таким злим. Такого насиченого кала він давно не нюхав. Будуть наказані всі! І дуже жорстоко!');
                    ratingChange = -100;
                }
                ctx.replyWithSticker(stickersIds.mayorPenalty);
            } else {
                if (Math.random() < 0.99) {
                    ctx.reply('Провівши огляд усіх матеріалів. Михайло Петрович задоволений якістю, ставить лайк і просить ватажка накинути кожному по 10 злотих');
                    ratingChange = 10;
                } else {
                    ctx.reply('Оце так рофл. Давно так представник не кекав векав. Він настільки задоволений що хоче вас бачить в Партії Кеків Народу, через що накинув вам +100 до вашого рейтингу челікослава');
                    ratingChange = 100;
                }
                ctx.replyWithSticker(stickersIds.mayorBonus);
            }
            updateDocs(ratingChange);
        }, 1000);
    }
}