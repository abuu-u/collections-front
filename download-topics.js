/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
const fs = require('fs')
const path = require('path')
const http = require('http')
const url = process.env.NEXT_PUBLIC_API + '/Collections/topics'
http
  .get(url, (res) => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    })
    res.on('end', () => {
      fs.writeFileSync(
        path.join(process.cwd(), 'shared/localization', 'topics.json'),
        data,
      )
    })
  })
  .on('error', (err) => {
    console.log(err.message)
  })
