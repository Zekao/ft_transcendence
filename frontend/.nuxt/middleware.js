const middleware = {}

middleware['auth'] = require('../middleware/auth.ts')
middleware['auth'] = middleware['auth'].default || middleware['auth']

export default middleware
