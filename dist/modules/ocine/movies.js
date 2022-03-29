"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovies = void 0;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
const request = require("request");
const cheerio_1 = require("cheerio");
const getMovies = () => {
    return new Promise((resolve) => {
        request('https://www.ocinerioshopping.es', function (error, response, body) {
            const $ = cheerio_1.default.load(body);
            const peliculas = [];
            $(".pelis-grid .peli-item").each((index, elem) => {
                const elem$ = cheerio_1.default.load(elem);
                const times = [];
                elem$('#today ~ .horasessio:not(.bloqueix)').each((index, e) => {
                    const e$ = cheerio_1.default.load(e);
                    times.push(e$.text().replace(/\t/g, '').replace(/\n/g, '').trim());
                });
                peliculas.push({
                    title: elem$("h4").text(),
                    times
                });
            });
            resolve(peliculas);
        });
    });
};
exports.getMovies = getMovies;
//# sourceMappingURL=movies.js.map