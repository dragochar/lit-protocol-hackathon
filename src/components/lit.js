import LitJsSdk from 'lit-js-sdk'

const client = new LitJsSdk.LitNodeClient()

class Lit {
  litNodeClient
  async connect() {
    await client.connect()
    this.litNodeClient = client
  }
}
export default new Lit()