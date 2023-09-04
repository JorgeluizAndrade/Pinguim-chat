const upstashRedisUrl = process.env.UPSTASH_REDIS_REST_URL;
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Comamnd = "zrange" | "sismember" | "get" | "smembers";

export async function fetchRedis(
  command: Comamnd,
  ...agrs: (string | number)[]
) {
  const commandUrl = `${upstashRedisUrl}/${command}/${agrs.join("/")}`;

  const reponse = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  if(!reponse.ok){
    throw new Error(`Error executing Redis command: ${reponse.statusText}`)
  }

  const data = await reponse.json()
  return data.result
}
