"use server"

export async function getUrl(id: string): Promise<string>
{
    const ret = `https://discord.com/channels/${process.env.DISCORD_SOURCE_SERVER}/${process.env.DISCORD_SOURCE_CHANNEL}/${id}`
    console.log(ret)
    return ret;
}

