import { config } from 'dotenv'
config({ path: './.env' })

const filename = 'payload.php\x00.jpg'
const blacklistMime: boolean = new RegExp(`(${process.env.FILE_BLACKLIST})`, 'gi').test(filename)

console.log('File Injection Ext Detected: ', blacklistMime)
