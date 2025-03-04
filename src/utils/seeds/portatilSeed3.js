const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');

const fs = require('fs');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteerExtra.use(StealthPlugin());

const PORTATILES = [];
let pageNumber = 1;
const urlbase = 'https://www.pccomponentes.com/portatiles';

const scraper = async () => {
  const browser = await puppeteer.launch({ headless: false }); // Mantiene el navegador abiert!!
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  await page.goto(urlbase, { waitUntil: 'networkidle2' });

  const buttonCookies = await page.$('#cookiesrejectAll');
  if (buttonCookies) await buttonCookies.click();

  await repeat(page);

  console.log(`Recolección completada: ${PORTATILES.length} productos.`);
  write(PORTATILES);
  await browser.close();
};

const repeat = async (page) => {
  while (pageNumber <= 65) {
    // Bucle hasta la última página
    console.log(`Scrapeando página ${pageNumber}...`);

    const products = await page.$$('.product-card');

    for (const product of products) {
      const portatil = {
        imagen: '',
        nombre: '',
        precio: ''
      };

      const imagen = await product.$('img');
      portatil.imagen = (await imagen?.evaluate((e) => e.src)) || '';

      const nombre = await product.$('.product-card__title');
      portatil.nombre =
        (await nombre?.evaluate((e) => e.textContent))?.trim() || '';

      const precio = await product.$('.product-card__price-container');
      const precioText =
        (await precio?.evaluate((e) => e.textContent))?.trim() || '';
      const arrayprecios = precioText.split('€');
      portatil.precio = arrayprecios[0] + '€';

      PORTATILES.push(portatil);
    }

    pageNumber++;
    if (pageNumber > 65) break;

    // Navega a la siguiente sin cerrar el navegador
    const urlNavegar = `${urlbase}?page=${pageNumber}`;
    console.log(`Navegando a: ${urlNavegar}`);
    await page.goto(urlNavegar, { waitUntil: 'networkidle2' });
  }
};

//Pa guardar los resultados en un JSON
const write = (PORTATILES) => {
  fs.writeFile('portatiles.json', JSON.stringify(PORTATILES, null, 2), () => {
    console.log('Archivo portatiles.json escrito.');
  });
};

scraper();
