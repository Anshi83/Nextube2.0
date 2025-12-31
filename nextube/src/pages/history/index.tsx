import HistoryContent from '@/components/HistoryContent'
import React, { Suspense } from 'react'

const index = () => {
  
  return (
    <div><h1 className='text-bold '>Watch History</h1>
    <Suspense fallback={<div>loading.....</div>}>
    <HistoryContent/></Suspense></div>
  )
}

export default index