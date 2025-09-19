import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') || '/'
  
  // Create response with redirect
  const response = NextResponse.redirect(new URL(path, request.url))
  
  // Clear the preview cookie
  response.cookies.delete('__next_preview_data')
  
  return response
} 
