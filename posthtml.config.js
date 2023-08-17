// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.local' });
module.exports = {
  plugins: {
    'posthtml-expressions': {
      locals: {
        apiKey: process.env.REWIRING_AMERICA_API_KEY,
      },
    },
  },
};
