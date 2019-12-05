const jayson = require('jayson')

module.exports = newProxy

function newProxy (unixSocket) {
  const client = jayson.client.tcp(unixSocket)


  function createRpcCall (client, name) {
    return function (...args) {
      return new Promise((resolve, reject) => {
        client.request(name, [...args], function (err, res) {
          if (err) reject(err)
          else resolve(res)
        })
      })
    }
  }

  const obj = {}

  const rpc = new Proxy(obj, {
    get: function (obj, name) {
      if (obj[name]) return obj[name]
      obj[name] = createRpcCall(client, name)
      return obj[name]
    }
  })

  return rpc
}
