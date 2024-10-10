import { type BatchCreate, type BatchProcessUpdate, type BatchRestore } from '@/domain/entities/dto/Batch.dto'
import { type ImageRequestedData, ImageRequested } from '@/domain/events/ImageRequested'
import { BatchIdError } from '@/infra/error/ErrorCatalog'
import { Observable } from '@/infra/events/Observer'

export class Batch extends Observable {
  id: string
  status: string
  origin: string
  modelName: string
  errorMessage: string
  images: string[]

  private constructor (
    id: string,
    status: string,
    readonly prompt: string,
    readonly sampler: string,
    readonly scheduler: string,
    readonly steps: number,
    images: string[],
    readonly size: number,
    origin: string,
    modelName: string,
    readonly negativePrompt: string,
    errorMessage: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    super()
    this.id = id
    this.status = status
    this.images = images ?? []
    this.origin = origin
    this.modelName = modelName
    this.errorMessage = errorMessage
  }

  static create (input: BatchCreate): Batch {
    const status = 'queued'
    return new Batch(
      '',
      status,
      input.prompt,
      input.sampler,
      input.scheduler,
      input.steps,
      input.images,
      input.size,
      '',
      '',
      input.negativePrompt ?? '',
      ''
    )
  }

  static restore (input: BatchRestore): Batch {
    return new Batch(
      input.id,
      input.status,
      input.prompt,
      input.sampler,
      input.scheduler,
      input.steps,
      input.images,
      input.size,
      input.origin,
      input.modelName,
      input.negativePrompt,
      input.errorMessage,
      input.createdAt,
      input.updatedAt
    )
  }

  async request ({ gateway, dimensions }: Omit<ImageRequestedData, 'batchId'>): Promise<void> {
    if (!this.id) throw new BatchIdError()
    await this.notify(new ImageRequested({ batchId: this.id, gateway, dimensions }))
  }

  process (): void {
    this.status = 'processing'
  }

  error (message: string): void {
    this.errorMessage = message
    this.status = 'error'
  }

  finish (): void {
    this.status = 'processed'
  }

  processUpdate (input: BatchProcessUpdate): void {
    this.origin = input.origin
    this.modelName = input.modelName
  }

  addImage (imageId: string): void {
    this.images.push(imageId)
  }

  removeImage (imageId: string): void {
    const newImages = this.images.filter((id) => id !== imageId)
    this.images = newImages
  }
}
