'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import Flowers from '@/components/canvas/Flowers'
import Computer from '@/components/canvas/Computer'

const Logo = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Logo), { ssr: false })
const Dog = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Dog), { ssr: false })
const Duck = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Duck), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 size-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  return (
    <>
      <div className='relative h-screen w-screen'>
        <View className='absolute inset-0 z-0'>
          <Suspense fallback={null}>
            <Flowers />
          </Suspense>
        </View>
        <div className='relative z-10 mx-auto flex w-full flex-col flex-wrap items-center md:flex-row lg:w-4/5'>
          {/* jumbo */}
          <div className='flex w-full flex-col items-start justify-center p-12 text-center md:w-2/5 md:text-left'>
            <p className='w-full uppercase'>art&tech polymath</p>
            <h1 className='my-4 text-5xl font-bold leading-tight'>zenbauhaus</h1>
            <p className='mb-8 text-2xl leading-normal'>lifelong learner driven by boundless curiosity</p>
          </div>
        </div>

        <div className='relative z-10 mx-auto flex w-full flex-col flex-wrap items-center p-12 md:flex-row lg:w-4/5'>
          {/* first row */}
          <div className='rounded-lg bg-white bg-opacity-50 p-6 backdrop-blur-md'>
            <h2 className='mb-3 text-3xl font-bold leading-none text-gray-800'>with a profound passion</h2>
            <p className='mb-8 text-2xl text-black'>for the synergy of art and technology</p>
          </div>
          {/*  <div className='relative my-12 h-48 w-full py-6 sm:w-1/2 md:mb-40'>
            <Computer/>
          </div> */}
          {/* second row */}
          <div className='relative my-12 h-48 w-full py-6 sm:w-1/2 md:mb-40'></div>
          <div className=' rounded-lg bg-white bg-opacity-50 p-6 backdrop-blur-md'>
            <h2 className='mb-3 text-3xl font-bold leading-none text-gray-800'>
              dedicated to being a bridge between creative vision and technical execution
            </h2>
            <p className='mb-8 text-lg text-gray-600'>
              whether supporting <span className='text-2xl font-bold'>artists</span> in making their{' '}
              <span className='text-2xl font-bold'>dreams</span> tangible or spicing up a simple technical query with a
              fresh idea,
            </p>
            <p className='mb-8 text-lg text-gray-600'>
              my heart lies at the crossroads of <span className='text-2xl font-bold'>imagination</span> and{' '}
              <span className='text-2xl font-bold'>innovation</span>.
            </p>
            <p className='mb-8 text-lg text-gray-600'>
              fortunate to work with both artistic and technical minds, continually learning the importance of
              <span className='text-2xl font-bold'> functionality</span>,{' '}
              <span className='text-2xl font-bold'>aesthetics</span> and{' '}
              <span className='text-2xl font-bold'>user experience</span>.
            </p>
            <p className='mb-8 text-lg text-gray-600'>
              every collaboration is an opportunity to unleash{' '}
              <span className='text-2xl font-bold'>visionary creativity</span> and{' '}
              <span className='text-2xl font-bold'>state of the art technology</span>.
            </p>
            <p className='mb-8 text-lg text-gray-600'>
              lets collaborate and bring new <span className='text-xl font-bold'>visions</span> to life together!
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
