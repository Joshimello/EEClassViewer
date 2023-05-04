import { json } from '@sveltejs/kit'
import puppeteer from 'puppeteer'
import cheerio from 'cheerio'

function fetchAll(urls, cookie) {
  return Promise.all(
    urls.map(url => fetch(url, { headers: { Cookie: cookie } })
      .then(r => r.json())
      .then(data => ({ data, url }))
      .catch(error => ({ error, url }))
    )
  )
}

const baseUrl = 'https://eeclass.nthu.edu.tw'
const listUrl = '/course/material/'

export const POST = (async ({ request }) => {
  const { courseid, cookie } = await request.json()

  const res = await (
    await fetch(baseUrl + listUrl + courseid, {
      method: 'GET',
      headers: {
        Cookie: `PHPSESSID=${cookie}`
      }
    })
  )
  .text()

  const $ = cheerio.load(res)
  const linkElements = $('tbody').find('a')

  let links = []

  linkElements.each(( index, value ) => {
    links = [...links, baseUrl + $(value).attr('href')]
  })

  // const final = await fetchAll(links, cookie)
  // return json(final)

  try {
    const browser = await puppeteer.launch({ headless: 'new' })
    const allpage = links.map( async (url, i) => {
      const page = await browser.newPage()
      console.log(`loading page: ${url}`)

      await page.setRequestInterception(true);
      page.on('request', request => {
        if (!request.isNavigationRequest()) {
          request.continue()
          return
        }

        const headers = request.headers()
        headers['Cookie'] = `PHPSESSID=${cookie}`
        request.continue({ headers })
      })

      await page.goto(url, { waitUntil: 'domcontentloaded' })

      console.log(`closing page: ${url}`)
      await page.close()
    })

    Promise.all(allpage).then(() => {
      browser.close()
    })
  } catch (error) {
    console.log(error)
  }

  return json(links)
})