/**
 * Inspired by: https://framer.university/resources/like-button-component
 */
'use client'
import { Separator, toast } from '@tszhong0411/ui'
import { motion } from 'framer-motion'
import * as React from 'react'
import useSWR from 'swr'
import { useDebouncedCallback } from 'use-debounce'

import { fetcher } from '@/lib/fetcher'
import { type Likes } from '@/types'

type LikeButtonProps = {
  slug: string
}

const LikeButton = (props: LikeButtonProps) => {
  const { slug } = props
  const [cacheCount, setCacheCount] = React.useState(0)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const { data, isLoading, mutate } = useSWR<Likes>(
    `/api/likes?slug=${slug}`,
    fetcher
  )

  const handleConfetti = async () => {
    const { clientWidth, clientHeight } = document.documentElement
    const boundingBox = buttonRef.current?.getBoundingClientRect?.()

    const targetY = boundingBox?.y ?? 0
    const targetX = boundingBox?.x ?? 0
    const targetWidth = boundingBox?.width ?? 0

    const targetCenterX = targetX + targetWidth / 2
    const confetti = (await import('canvas-confetti')).default

    await confetti({
      zIndex: 999,
      particleCount: 100,
      spread: 100,
      origin: {
        y: targetY / clientHeight,
        x: targetCenterX / clientWidth
      },
      shapes: [confetti.shapeFromText({ text: '❤️', scalar: 2 })]
    })
  }

  const onLikeSaving = useDebouncedCallback(async (value: number) => {
    try {
      const res = await fetch('/api/likes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slug, value })
      })

      const newData = (await res.json()) as Likes

      await mutate(newData)
    } catch {
      toast.error('Unable to like this post. Please try again.')
    } finally {
      setCacheCount(0)
    }
  }, 1000)

  const handleLike = () => {
    if (isLoading || !data || data.currentUserLikes + cacheCount >= 3) return

    const value = cacheCount === 3 ? cacheCount : cacheCount + 1
    setCacheCount(value)

    if (data.currentUserLikes + cacheCount === 2) {
      handleConfetti()
    }

    return onLikeSaving(value)
  }

  return (
    <div className='mt-12 flex justify-center'>
      <button
        ref={buttonRef}
        className='flex items-center gap-3 rounded-xl bg-zinc-900 px-4 py-2 text-lg text-white'
        type='button'
        onClick={handleLike}
        aria-label='Like this post'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='28'
          height='28'
          viewBox='0 0 24 24'
          strokeWidth='2'
          stroke='#ef4444'
          className='relative overflow-hidden'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <defs>
            <clipPath id='clip-path'>
              <path d='M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572' />
            </clipPath>
          </defs>
          <path d='M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572' />
          <g clipPath='url(#clip-path)'>
            <motion.rect
              x='0'
              y='0'
              width='24'
              height='24'
              fill='#ef4444'
              initial={{
                y: '100%'
              }}
              animate={{
                y: data
                  ? `${100 - (data.currentUserLikes + cacheCount) * 33}%`
                  : '100%'
              }}
            />
          </g>
        </svg>
        Like{data && data.likes + cacheCount === 1 ? '' : 's'}
        <Separator orientation='vertical' className='bg-zinc-700' />
        {isLoading || !data ? (
          <div> -- </div>
        ) : (
          <div>{data.likes + cacheCount}</div>
        )}
      </button>
    </div>
  )
}

export default LikeButton
