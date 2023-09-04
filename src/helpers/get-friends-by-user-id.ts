import { fetchRedis } from "./redis"

export const getFriendsByUserId = async (userId:string) => {
    const friendsId = (await fetchRedis('smembers', `user:${userId}:friends`)) as string[]  

    const friends = await Promise.all(
        friendsId.map(async(friendId) => {
            const friend = await fetchRedis('get', `user:${friendId}`) as string
            const parseFriend = JSON.parse(friend) as User
            return parseFriend
        })
    )
    return friends
}       