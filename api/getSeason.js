const getSeason = async () => {
  const result = await fetch('https://overwatch.blizzard.com/en-us/season/')
  const html = await result.text()

  console.log('html', html)
  return ''
}

export default getDownloads
