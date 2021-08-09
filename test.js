const puppeteer = require('puppeteer')
const fs = require('fs/promises')
const EventEmmiter = require('events')
const emitter = new EventEmmiter()
emitter.setMaxListeners(0)

const express = require('express')
const bodyParser = require('body-parser')
const AirBnb = require('./data')
//const getData = require('./test.js')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const dbConfig = require('./dburl.js')
const mongoose = require('mongoose')

mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    //const airBnb = new AirBnb()
    //airBnb.save()

    console.log('successfully connected')
    //console.log(getData)
  })
  .catch((err) => {
    console.log('not connected', err)
    process.exit()
  })

async function mainPage() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.airbnb.com/')

  await page.waitForSelector('._wy1hs1')

  const names = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a._wy1hs1')).map((x) => x.href)
  })

  console.log(names)
  await fs.writeFile('names.txt', names.join('\r\n'))

  await browser.close()
  return names
}

async function hotelPage() {
  const links = await mainPage()
  const hotelLinks = []
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  for (let link of links) {
    await page.goto(link)

    await page.waitForSelector('._mm360j')

    const hotelLink = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a._mm360j')).map(
        (x) => x.href
      )
    })

    for (let hotel of hotelLink) {
    await hotelLinks.push(hotel)
    }
  }
  await browser.close()
  await console.log(hotelLinks)
  return hotelLinks
}

async function dataPage() {
  const links = await hotelPage()
  const title = []
  const rating = []
  const noOfRating = []
  const data = []
  var testId = 0

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(0)

  for (let link of links) {
    testId = testId + 1
    console.log(testId)

    await page.goto(link)

    await page.waitForSelector('._fecoyn4', { waitUntil: 'load', timeout: 0 })

    const titles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h1._fecoyn4')).map(
        (x) => x.textContent
      )
    })

    //await console.log(titles[0])
    //await title.push(titles[0])

    /*  await page.waitForSelector('span._1ne5r4rt', {
      waitUntil: 'load',
      timeout: 0,
    })

    const ratings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('span._1ne5r4rt')).map(
        (x) => x.textContent
      )
    })
*/
    // await console.log(ratings[0])
    //await rating.push(ratings[0])

    await page.waitForSelector(' button._1qf7wt4w', {
      waitUntil: 'load',
      timeout: 0,
    })

    const noOfRatings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button._1qf7wt4w')).map(
        (x) => x.textContent
      )
    })
    // await console.log(noOfRatings[0])
    //await noOfRating.push(noOfRatings[0])
    const dataObject = {
      title: titles[0],
      ratings:5
      Reviews: noOfRatings[0],
    }

    const air = new AirBnb(dataObject)
    air.save()
    console.log(dataObject)
    //await data.push(dataObject)
    // await console.log(dataObject)
  }

  await browser.close()
  //await console.log(data)
}
dataPage()