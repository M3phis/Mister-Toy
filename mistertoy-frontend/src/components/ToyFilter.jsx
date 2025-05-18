import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import debounce from 'lodash/debounce'
import { toyService } from '../services/toy.service'
import { setFilter } from '../store/toy.slice'

export function ToyFilter() {
  const dispatch = useDispatch()
  const [filterBy, setFilterBy] = useState({
    txt: '',
    inStock: undefined,
    labels: [],
    sortBy: '',
  })

  const debouncedSetFilter = useCallback(
    debounce((filter) => {
      dispatch(setFilter(filter))
    }, 500),
    [dispatch]
  )

  useEffect(() => {
    debouncedSetFilter(filterBy)
    return () => {
      debouncedSetFilter.cancel()
    }
  }, [filterBy, debouncedSetFilter])

  const handleChange = (field, value) => {
    setFilterBy((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <section className="toy-filter">
      <input
        type="text"
        placeholder="Search toy name..."
        value={filterBy.txt}
        onChange={(e) => handleChange('txt', e.target.value)}
      />

      <select
        value={
          filterBy.inStock === undefined ? '' : filterBy.inStock.toString()
        }
        onChange={(e) => {
          const value =
            e.target.value === '' ? undefined : e.target.value === 'true'
          handleChange('inStock', value)
        }}
      >
        <option value="">All</option>
        <option value="true">In Stock</option>
        <option value="false">Out of Stock</option>
      </select>

      <select
        multiple
        value={filterBy.labels}
        onChange={(e) => {
          const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
          )
          handleChange('labels', values)
        }}
      >
        {toyService.getLabels().map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={filterBy.sortBy}
        onChange={(e) => handleChange('sortBy', e.target.value)}
      >
        <option value="">Sort by...</option>
        <option value="name">Name</option>
        <option value="price">Price</option>
        <option value="created">Created</option>
      </select>
    </section>
  )
}
