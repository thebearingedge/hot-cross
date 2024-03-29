import { Server } from 'http'
import { expect } from 'chai'
import request from 'supertest'
import hotCross from './node.js'
import { ok } from './index.test.js'


describe('node', () => {

  let router: ReturnType<typeof hotCross>
  let client: ReturnType<typeof request>

  beforeEach('instantiate a new router', () => {
    router = hotCross()
    client = request(new Server(router))
  })

  it('handles node http requests', async () => {
    router.get('/api/foo', () => ok())
    await client
      .get('/api/foo')
      .expect(200)
  })

  it('forwards the response body', async () => {
    router.get('/api/foo', () => ok('hello, node'))
    await client
      .get('/api/foo')
      .expect(200, 'hello, node')
  })

  it('forwards the request body', async () => {
    router.post('/api/foo', async ({ req }) => {
      const data = await req.json()
      expect(data).to.deep.equal({ hello: 'node' })
      return ok('ok')
    })
    await client
      .post('/api/foo')
      .send({ hello: 'node' })
      .expect(200, 'ok')
  })

})
