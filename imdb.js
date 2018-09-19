const puppeteer = require('puppeteer');
const fs = require('fs-extra');

(async function main() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.imdb.com/movies-in-theaters/?ref_=nv_mv_inth');
    await page.waitForSelector('.list_item');
    const sections = await page.$$('.list_item');

    await fs.writeFile('movies.csv', 'Movie Name,Rating,Description\n');

    let numberOfMovies = sections.length;

    //number of movies in theaters
    console.log(`Movies in theaters: ${numberOfMovies}`);

    for (let i = 0; i < numberOfMovies; i++) {
      const section = sections[i];
      const movieName = await section.$eval('h4', h4 => h4.innerText);
      const movieDesc = await section.$eval('.outline', outline => outline.innerText);
      const movieRating = await section.$eval('.rating_txt', rating_txt => rating_txt.innerText);
      //console.log('movie name', movieName); 
      await fs.appendFile('movies.csv', `"${movieName}", "${movieRating}", "${movieDesc}",\n`);
    }

    console.log('done');
    await browser.close();
  } catch (e) {
    console.log('error...', e);
  }
})();