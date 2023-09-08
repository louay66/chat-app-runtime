const redisRestUrl = process.env.UPSTASH_REDIS_REST_URL
const redisRestToken = process.env.UPSTASH_REDIS_REST_TOKEN

type commands = 'zrange' | 'sismember' | 'get' | 'smembers'


export async function fetchRedis(
   command: commands,
   ...args: (string | number)[]
) {

   const commandUrl = `${redisRestUrl}/${command}/${args.join('/')}`

   const response = await fetch(commandUrl,
      {
         headers: {
            Authorization: `Bearer ${redisRestToken}`,
         },
         cache: 'no-store',
      })
   if (!response.ok) {
      throw new Error(`Error executing Redis command: ${response.statusText}`)
   }
   const data = await response.json()
   return data.result
}