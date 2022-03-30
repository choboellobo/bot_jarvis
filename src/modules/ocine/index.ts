import TelegramBot = require("node-telegram-bot-api");
import { getMovies, Movie } from "./movies"
const { exec } = require('child_process')
import * as fs from 'fs';
import * as path from 'path';

export const listOfMovies = async (bot: TelegramBot, msg: TelegramBot.Message ) => {
    await bot.sendMessage(msg.chat.id, "Señor, esperé que miro en los cines de RioShopping la cartelera, no se vaya.");
    const movies: any[] = await getMovies();
    let message = ''
        for(const movie of movies ) {
            if(movie.times.length) {
                message += `${movie.title} horarios: ${movie.times.join()} \n\n`
            }
        }
    await bot.sendMessage(msg.chat.id, message);
    const options = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Si', callback_data: 'search_movies_yes'}]                    ]
            }
        }
    await bot.sendMessage(msg.chat.id, '¿Quiere que le reserve alguna entrada?', options);
}

export const wizardBuyTickets = async (bot: TelegramBot, msg: TelegramBot.Message) => {
    const movies = await getMovies();
    

    const step2 = await bot.sendMessage(msg.chat.id, '¿Qué pelicula quiere ver? Señor', { reply_markup: { force_reply: true }})
    const movie_selected_fn = async (step: TelegramBot.Message): Promise<Movie> => {
        return new Promise( (resolve, reject) => {
            bot.onReplyToMessage(msg.chat.id, step.message_id, async ({text}) => {
                const movieIndex = movies.findIndex( elem => elem.title.toLowerCase().match( new RegExp( text.toLowerCase() ) ));
                if(movieIndex) resolve(movies[movieIndex])
                else reject(true)
            })
        })
    }
    const movie = await movie_selected_fn(step2)

    const step3 =  await bot.sendMessage(msg.chat.id, `Le comprare ${ movie.title }, a que hora? Hay disponibles ${movie.times.join()} `, { reply_markup: { force_reply: true }});
    const time_selected_fn = async (step: TelegramBot.Message): Promise<string> => {
        return new Promise( (resolve, reject) => {
            bot.onReplyToMessage(msg.chat.id, step.message_id, async ({text}) => {
                const time = movie.times.find( time => text.match(new RegExp(time)));
                if( time) resolve( time )
                else reject(true)
            })
        })
    }

    const time = await time_selected_fn(step3);

    const step1 = await bot.sendMessage(msg.chat.id, 'Por último señor, ¿Cuantas le compro?', { reply_markup: { force_reply: true }})
    const num_of_tickets_fn = async (step: TelegramBot.Message): Promise<number> => {
        return new Promise( async (resolve) => {
            bot.onReplyToMessage(msg.chat.id, step.message_id, async ({text}) => {
                if( isNaN( +text ) ) {
                    bot.sendMessage(msg.chat.id, 'Debe indicar un número, señor')
                    wizardBuyTickets(bot, msg)
                }
                else {
                    resolve(+text)
                }
            })
        })
    }
    const num_of_tickets = await num_of_tickets_fn(step1)

    await bot.sendMessage(msg.chat.id, `Señor, voy a comprar ${num_of_tickets} ${ num_of_tickets > 1 ? 'entradas': 'entrada'} de la pelicula ${ movie.title } para la sesión de las ${time}, por favor espere...`)
    try {
        await buy(movie.title, time, num_of_tickets);
        bot.sendMessage(msg.chat.id, 'Ya estan compradas señor, le envio el video de como lo he hecho');
        bot.sendVideo(msg.chat.id, Buffer.from( fs.readFileSync( path.join(__dirname,'..','..','..', 'cypress', 'videos', 'ocine.spec.js.mp4')) ) )
    } catch (error) {
        bot.sendMessage(msg.chat.id, `Señor, lo siento no he podido comprar las entradas, esto es lo que ha ocurrido: ${error}`);
        bot.sendVideo(msg.chat.id, Buffer.from( fs.readFileSync( path.join(__dirname,'..','..','..', 'cypress', 'videos', 'ocine.spec.js.mp4')) ) )
    } 
}

function buy(movie: string, time: string, quantity: number) {
    return new Promise( (resolve, reject) => {        
        exec('./node_modules/cypress/bin/cypress run --spec ./cypress/integration/ocine.spec.js --browser chromium --env data=\'{\"quantity\": '+quantity+' ,\"movie\":\"'+movie+'\", \"time\":\"'+time+'\" }\' ',
        (error, stdout, stderr) => {
            if(error) reject(error);
            else resolve(true)
            console.log("1", stdout)
        })
    })
}
