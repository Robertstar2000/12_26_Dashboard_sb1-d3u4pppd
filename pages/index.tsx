import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Tallman Dashboard</title>
        <meta name="description" content="Tallman Dashboard Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Tallman Dashboard</h1>
      </main>
    </div>
  )
}

export default Home
