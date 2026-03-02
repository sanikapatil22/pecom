"use client";
import { Prisma, Product, Review } from '@prisma/client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { AutoComplete } from './ui/autocomplete'

type Props = {
  data: Prisma.ProductGetPayload<{
    include: {
      reviews: true
    }
  }>[]
}

const SearchComponent = (props: Props) => {
  const router = useRouter()
  const [searchValue, setSearchValue] = React.useState('')
  const [selectedValue, setSelectedValue] = React.useState('')

  const handleSearchValueChange = (value: string) => {
    setSearchValue(value)
  }

  const handleSelectedValueChange = (value: string) => {
    setSelectedValue(value)
    // Navigate to product detail page when a product is selected
    if (value) {
      router.push(`/product/${value}`)
    }
  }

  return (
    <AutoComplete
      items={props.data}
      placeholder="Search for products"
      searchValue={searchValue}
      onSearchValueChange={handleSearchValueChange}
      selectedValue={selectedValue}
      onSelectedValueChange={handleSelectedValueChange}
    />
  )
}

export default SearchComponent
