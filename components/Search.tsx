import prisma from '@/app/lib/db'
import { unstable_noStore as noStore } from 'next/cache'
import React from 'react'
import { AutoComplete } from './ui/autocomplete'
import SearchComponent from './SearchComponent'

type Props = {}

const getSearchData = async () => {
  const data = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      reviews: true
    }
  })
  return data
}

const Search = async (props: Props) => {
  noStore()
  const data = await getSearchData()
  return (
    <SearchComponent data={data} />
  )
}

export default Search
