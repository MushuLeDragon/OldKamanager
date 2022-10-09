import {Resource} from "./Resource";

type Component = Resource & {
  name: string,
  quantity: number,
  _id: number,
  imgUrl: string,
  isEmpty: boolean,
}

type Gear = {
  _id: number,
  name: string,
  level: number,
  type: string,
  imgUrl: string,
  description: string,

  sold: number,

  currentPrice: number,
  craftingPrice: number,
  ratio: number,

  isInInventory: boolean,
  isWanted: boolean,
  isInMarket: boolean,
  toBeCrafted: number,
  onWishList: number,

  recipe: Component[]
}

export type {Gear, Component};