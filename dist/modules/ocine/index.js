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
exports.wizardBuyTickets = exports.listOfMovies = void 0;
const movies_1 = require("./movies");
const { exec } = require('child_process');
const fs = require("fs");
const path = require("path");
const listOfMovies = (bot, msg) => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.sendMessage(msg.chat.id, "Señor, esperé que miro en los cines de RioShopping la cartelera, no se vaya.");
    const movies = yield (0, movies_1.getMovies)();
    let message = '';
    for (const movie of movies) {
        if (movie.times.length) {
            message += `${movie.title} horarios: ${movie.times.join()} \n\n`;
        }
    }
    yield bot.sendMessage(msg.chat.id, message);
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Si', callback_data: 'search_movies_yes' }]
            ]
        }
    };
    yield bot.sendMessage(msg.chat.id, '¿Quiere que le reserve alguna entrada?', options);
});
exports.listOfMovies = listOfMovies;
const wizardBuyTickets = (bot, msg) => __awaiter(void 0, void 0, void 0, function* () {
    const movies = yield (0, movies_1.getMovies)();
    const step2 = yield bot.sendMessage(msg.chat.id, '¿Qué pelicula quiere ver? Señor', { reply_markup: { force_reply: true } });
    const movie_selected_fn = (step) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            bot.onReplyToMessage(msg.chat.id, step.message_id, ({ text }) => __awaiter(void 0, void 0, void 0, function* () {
                const movieIndex = movies.findIndex(elem => elem.title.toLowerCase().match(new RegExp(text.toLowerCase())));
                if (movieIndex)
                    resolve(movies[movieIndex]);
                else
                    reject(true);
            }));
        });
    });
    const movie = yield movie_selected_fn(step2);
    const step3 = yield bot.sendMessage(msg.chat.id, `Le comprare ${movie.title}, a que hora? Hay disponibles ${movie.times.join()} `, { reply_markup: { force_reply: true } });
    const time_selected_fn = (step) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            bot.onReplyToMessage(msg.chat.id, step.message_id, ({ text }) => __awaiter(void 0, void 0, void 0, function* () {
                const time = movie.times.find(time => text.match(new RegExp(time)));
                if (time)
                    resolve(time);
                else
                    reject(true);
            }));
        });
    });
    const time = yield time_selected_fn(step3);
    const step1 = yield bot.sendMessage(msg.chat.id, 'Por último señor, ¿Cuantas le compro?', { reply_markup: { force_reply: true } });
    const num_of_tickets_fn = (step) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            bot.onReplyToMessage(msg.chat.id, step.message_id, ({ text }) => __awaiter(void 0, void 0, void 0, function* () {
                if (isNaN(+text)) {
                    bot.sendMessage(msg.chat.id, 'Debe indicar un número, señor');
                    (0, exports.wizardBuyTickets)(bot, msg);
                }
                else {
                    resolve(+text);
                }
            }));
        }));
    });
    const num_of_tickets = yield num_of_tickets_fn(step1);
    yield bot.sendMessage(msg.chat.id, `Señor, voy a comprar ${num_of_tickets} ${num_of_tickets > 1 ? 'entradas' : 'entrada'} de la pelicula ${movie.title} para la sesión de las ${time}, por favor espere...`);
    try {
        yield buy(movie.title, time, num_of_tickets);
        bot.sendMessage(msg.chat.id, 'Ya estan compradas señor, le envio el video de como lo he hecho');
        bot.sendVideo(msg.chat.id, Buffer.from(fs.readFileSync(path.join(__dirname, '..', '..', '..', 'cypress', 'videos', 'ocine.spec.js.mp4'))));
    }
    catch (error) {
        bot.sendMessage(msg.chat.id, `Señor, lo siento no he podido comprar las entradas, esto es lo que ha ocurrido: ${error}`);
    }
});
exports.wizardBuyTickets = wizardBuyTickets;
function buy(movie, time, quantity) {
    return new Promise((resolve, reject) => {
        exec('./node_modules/cypress/bin/cypress run --spec ./cypress/integration/ocine.spec.js --browser chrome --env data=\'{\"quantity\": ' + quantity + ' ,\"movie\":\"' + movie + '\", \"time\":\"' + time + '\" }\' ', (error, stdout, stderr) => {
            if (error)
                reject(error);
            else
                resolve(true);
            console.log("1", stdout);
        });
    });
}
//# sourceMappingURL=index.js.map