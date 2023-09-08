import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
   try {
      const body = await req.json()

      const { id: idToadd } = z.object({ id: z.string() }).parse(body)

      const session = await getServerSession(authOptions)

      if (!session) {
         return new Response('Unauthorized', { status: 401 })
      }

      const isAlredyFriend = await fetchRedis('sismember', `user:${session.user.id}:friends`, idToadd)

      if (isAlredyFriend) {
         return new Response('Alredy Friend', { status: 400 })
      }
      const hasFriendRequest = await fetchRedis(
         'sismember',
         `user:${session.user.id}:incoming_friend_requests`,
         idToadd
      )
      if (!hasFriendRequest) {
         return new Response('No friend request', { status: 400 })
      }
      await db.sadd(`user:${session.user.id}:friends`, idToadd)
      await db.sadd(`user:${idToadd}:friends`, session.user.id)
      await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToadd)
      return new Response('OK')
   }
   catch (error) {
      console.log(error)

      if (error instanceof z.ZodError) {
         return new Response('Invalid request payload', { status: 422 })
      }

      return new Response('Invalid request', { status: 400 })

   }

}
