import {promises as fs} from 'fs'
import fetch from 'node-fetch'
import Parser from 'rss-parser'

import {PLACEHOLDERS, NUMBER_OF, USER_AGENT} from './constants.js'

const parser = new Parser()

const getLatestArticlesFromBlog = () =>
    parser.parseURL('https://albert.garcia.gibert.es/index.xml').then(data => data.items)

;(async () => {
    const [template, articles] = await Promise.all([
        fs.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
        getLatestArticlesFromBlog()
    ])

    // create latest articles markdown
    const latestArticlesMarkdown = articles.slice(0, NUMBER_OF.ARTICLES)
        .map(({title, link}) => `- [${title}](${link})`)
        .join('\n')

    // replace all placeholders with info
    const newMarkdown = template
        .replace(PLACEHOLDERS.LATEST_ARTICLES, latestArticlesMarkdown)

    await fs.writeFile('README.md', newMarkdown)
})()
