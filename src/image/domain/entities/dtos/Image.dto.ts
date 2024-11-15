export interface ImageCreate {
  width: number
  height: number
  seed: number
  path: string
  batchId: string
}

export type ImageRestore = ImageCreate & {
  id: string
  aspectRatio: string
  likes: number
  authorName: string
  authorAvatar: string
  createdAt: Date
  updatedAt: Date
}
