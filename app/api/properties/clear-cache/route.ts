import { NextResponse } from 'next/server'
import { clearCache, getCacheStats } from '@/lib/scraper/cache'

export async function POST() {
  try {
    clearCache()
    
    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully',
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const stats = getCacheStats()
    
    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}

