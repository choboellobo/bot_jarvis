import TelegramBot = require("node-telegram-bot-api");
import { listOfMovies, wizardBuyTickets } from "./modules/ocine";

class Bot {
    bot: TelegramBot
    constructor() {
       this.bot = new TelegramBot('1847844543:AAGmjDnC7kxaGPo-Utx4b34l1Pq9jb-tzmk', { polling: true})
       this.events();
       this.bot.on('message', msg => {
           if(msg.text === 'Hola') this.start(msg);
       }) 
       this.bot.onText(/\/start/, async (msg:TelegramBot.Message) => {
            this.start(msg)
        })
    }
    start(msg: TelegramBot.Message) {
        
        const options: TelegramBot.SendMessageOptions = {
            reply_markup : {
                inline_keyboard : [
                    [ {text: '¿Qué peliculas hay hoy?', callback_data: 'search_movies'} ]
                ]
            }
        }
        this.bot.sendMessage(msg.chat.id, 'Hola señor, soy Jarvis y estoy aquí para ayudarle.', options)
    }

    private events() {
        this.bot.on('callback_query', async (msg_query: TelegramBot.CallbackQuery) => {
            switch(msg_query.data) {
                case 'search_movies':
                    await listOfMovies(this.bot, msg_query.message);
                    break;
                case 'search_movies_yes':
                    await wizardBuyTickets(this.bot, msg_query.message );
                    break;
            }
        })
    }
    
}
export default Bot
