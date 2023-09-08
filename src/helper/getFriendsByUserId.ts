import { FC } from 'react'
import { fetchRedis } from './redis'



const getFriendsByUserId = async (userId: string) => {

   // retrive all friends member of user conect 
   const friendIds = await fetchRedis('smembers', `user:${userId}:friends`) as string[]
   const friends = await Promise.all(
      friendIds.map(async (friendId) => {
         const friend = await fetchRedis('get', `user:${friendId}`) as string
         const parserFriend = JSON.parse(friend) as User
         return parserFriend
      })
   )
   return friends
}

export default getFriendsByUserId