const puppeteer = require('puppeteer');
// const { connectDB } = require('../../config/db');
// const Portatil = require('../../api/models/portatil');
// const { mongoose } = require('mongoose');
const fs = require('fs');

const PORTATILES = [];

const scraper = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.pccomponentes.com/portatiles');
  //Se crea el elemento, se espera para elegir por id y luego se evalua y se clicka
  const buttonCookies = await page.waitForSelector('#cookiesrejectAll');
  await buttonCookies.evaluate((e) => e.click());
  //Seleccionamos el elemento, también se puede evaluar al mismo tiempo
  repeat(page, browser);
};

const repeat = async (page, browser) => {
  const products = await page.$$('.product-card');

  for (const product of products) {
    const portatil = {
      imagen: '',
      nombre: '',
      precio: ''
    };

    const imagen = await product.$('img');
    const imagenSrc = (await imagen?.evaluate((e) => e.src)) || '';

    portatil.imagen = imagenSrc;

    const nombre = await product.$('.product-card__title');
    const nombreText = (await nombre?.evaluate((e) => e.textContent)) || '';

    portatil.nombre = nombreText;

    const precio = await product.$('.product-card__price-container');
    const precioText = (await precio?.evaluate((e) => e.textContent)) || '';
    const arrayprecios = precioText.split('€');
    portatil.precio = arrayprecios[0] + '€';

    PORTATILES.push(portatil);
  }

  try {
    await page.$eval("[aria-label='Página siguiente']", (e) => e.click());
    //console.log('Pasamos a siguiente página');
    await page.waitForNavigation();

    console.log(page.$("[aria-label='Página siguiente']"));
    //console.log(`llevamos${PORTATILES.length} recolectados`);
    repeat(page);
  } catch (error) {
    //console.log(`llevamos${PORTATILES.length} recolectados`);
    await browser.close();
  }
};

// write(PORTATILES);

//

const write = (PORTATILES) => {
  fs.writeFile('portatiles.json', JSON.stringify(PORTATILES), () => {
    console.log('Archivo escrito');
  });
};

scraper();
