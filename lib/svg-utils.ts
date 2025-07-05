import { STITCH_SVG_MAP } from './stitch-mappings'

// SVG loading cache
let loadedSVGs = new Map<string, string>()

export async function loadSVG(filename: string): Promise<string> {
  if (loadedSVGs.has(filename)) {
    return loadedSVGs.get(filename)!
  }
  
  try {
    const response = await fetch(`/stitches/${filename}`)
    if (!response.ok) {
      console.warn(`Could not load SVG: ${filename}`)
      return ''
    }
    const svgContent = await response.text()
    loadedSVGs.set(filename, svgContent)
    return svgContent
  } catch (error) {
    console.error(`Error loading SVG ${filename}:`, error)
    return ''
  }
}

export async function loadAllSVGs(patternSequence: string[]): Promise<void> {
  const uniqueStitchTypes = [...new Set(patternSequence)]
  
  const promises = uniqueStitchTypes.map(async (stitchType) => {
    const stitchInfo = STITCH_SVG_MAP[stitchType] || STITCH_SVG_MAP['unknown']
    return loadSVG(stitchInfo.file)
  })
  
  await Promise.all(promises)
}

export function createStitchElement(svgContent: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgContent, 'image/svg+xml')
  const svgElement = doc.querySelector('svg')
  
  if (!svgElement) return `<circle r="8" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2"/>`
  
  // Extract paths and basic shapes
  const paths = Array.from(svgElement.querySelectorAll('path, circle, ellipse, rect, line'))
  const pathElements = paths.map(el => el.outerHTML).join('')
  
  return pathElements || `<circle r="8" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2"/>`
}

export function getSVGContent(filename: string): string {
  return loadedSVGs.get(filename) || ''
}

// Reset SVG cache (useful for testing)
export function resetSVGCache(): void {
  loadedSVGs = new Map()
} 