const photos: string[] = [
  'https://i.pinimg.com/564x/8c/c3/6f/8cc36f4196e345e100afaa0e42aaf660.jpg',
  'https://i.pinimg.com/564x/87/76/49/877649718662628399a0ec354905a7bd.jpg',
  'https://i.pinimg.com/564x/c8/44/9f/c8449ff9a9c9f34146d65dd11de742f7.jpg',
]

export default function getMotivationPhoto() {
  const randomElement = (() =>
    photos[Math.floor(Math.random() * photos.length)])()
  return randomElement
}
