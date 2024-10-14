export enum Scenes {
  lobby = "lobby"
}

export type User = {
    id: string,
    username: string,
    global_name: string,
    avatar: string,
    discriminator: number
}


export type GameState = {
  _id: string,
  scene: Scenes,
  lobby: User[]
}


