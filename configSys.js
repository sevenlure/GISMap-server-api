if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

export const PORT = 3405

// prettier-ignore
export const MONGO_OPTIONS = {
  uri: process.env.MONGO_URI || 'mongodb://35.226.214.82:27017/awesomeplaces',
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS,
  db_options: {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
}
