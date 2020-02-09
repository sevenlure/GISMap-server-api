if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

export const PORT = 3405
export const JWT_SECRET = 'JWT_SECRET'
export const JWT_SECRET_ADMIN = 'JWT_SECRET_ADMIN'

// prettier-ignore
export const MONGO_OPTIONS = {
  uri: process.env.MONGO_URI || 'mongodb://35.226.214.82:27017/awesomeplaces',
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS,
  db_options: {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    reconnectInterval: 5000,
    reconnectTries: Number.MAX_VALUE
  }
}
