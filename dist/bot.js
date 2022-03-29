"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TelegramBot = require("node-telegram-bot-api");
const ocine_1 = require("./modules/ocine");
class Bot {
    constructor() {
        this.bot = new TelegramBot('1847844543:AAGmjDnC7kxaGPo-Utx4b34l1Pq9jb-tzmk', { polling: true });
        this.events();
        this.bot.on('message', msg => {
            if (msg.text === 'Hola')
                this.start(msg);
        });
        this.bot.onText(/\/start/, (msg) => __awaiter(this, void 0, void 0, function* () {
            this.start(msg);
        }));
    }
    start(msg) {
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '¿Qué peliculas hay hoy?', callback_data: 'search_movies' }]
                ]
            }
        };
        this.bot.sendMessage(msg.chat.id, 'Hola señor, soy Jarvis y estoy aquí para ayudarle.', options);
    }
    events() {
        this.bot.on('callback_query', (msg_query) => __awaiter(this, void 0, void 0, function* () {
            switch (msg_query.data) {
                case 'search_movies':
                    yield (0, ocine_1.listOfMovies)(this.bot, msg_query.message);
                    break;
                case 'search_movies_yes':
                    yield (0, ocine_1.wizardBuyTickets)(this.bot, msg_query.message);
                    break;
            }
        }));
    }
}
exports.default = Bot;
//# sourceMappingURL=bot.js.map