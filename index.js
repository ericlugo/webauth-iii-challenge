const server = require(`./server.js`);
const secret = require('./config/secrets.js');

const port = secret.PORT || 5050;

server.listen(port, () => {
  console.log(`\n*** Now listening on port ${port} ***\n`);
});
