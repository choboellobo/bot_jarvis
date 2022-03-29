process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import * as request from "request";
import cheerio from 'cheerio'
export interface Movie {
    times: string[],
    title: string
}
export const  getMovies = (): Promise<Movie[]> => {
    return new Promise( (resolve) => {
        request('https://www.ocinerioshopping.es', function (error, response, body) {
        const $ = cheerio.load(body);

        const peliculas = [];
        $(".pelis-grid .peli-item").each( (index, elem) => {
            const elem$ = cheerio.load(elem);
            const times = []
            elem$('#today ~ .horasessio:not(.bloqueix)').each( (index, e) => {
                const e$ = cheerio.load(e);
                times.push( e$.text().replace(/\t/g, '').replace(/\n/g, '').trim() )
            })
            peliculas.push( {
                title: elem$("h4").text(),
                times
            } );
        })
        resolve( peliculas );
        });
    })
}

