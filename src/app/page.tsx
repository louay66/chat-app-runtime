import { FC } from 'react'
import {db }  from '../lib/db'

interface pageProps {
  
}

const page: FC<pageProps> = ({}) => {
  db.set('page','page')
  return <div>page</div>
}

export default page
