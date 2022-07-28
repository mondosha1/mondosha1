import { URL } from '@mondosha1/string'

export function getImageAsync(url: URL): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = url
    image.onload = () => resolve(image)
    image.onerror = error => reject(error)
  })
}
