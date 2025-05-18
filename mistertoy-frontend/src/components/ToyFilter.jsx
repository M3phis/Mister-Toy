import { useState, useEffect, useCallback, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import debounce from 'lodash/debounce'
import { toyService } from '../services/toy.service'
import { setFilter, loadToys } from '../store/toy.slice'
import { selectFilterState } from '../store/toy.selectors'

export const ToyFilter = memo(function ToyFilter() {
  const dispatch = useDispatch()
  const currentFilter = useSelector(selectFilterState)
  const [filterBy, setFilterBy] = useState(currentFilter)

  // Create stable debounced function for text search only
  const debouncedTextSearch = useCallback(
    debounce((txt) => {
      dispatch(setFilter({ txt }))
      dispatch(loadToys())
    }, 500),
    []
  )

  // Immediate filter update for non-text filters
  const updateFilter = useCallback(
    (updates) => {
      dispatch(setFilter(updates))
      dispatch(loadToys())
    },
    [dispatch]
  )

  // Handle text search separately with debounce
  const handleTextChange = useCallback(
    (txt) => {
      setFilterBy((prev) => ({ ...prev, txt }))
      debouncedTextSearch(txt)
    },
    [debouncedTextSearch]
  )

  // Handle all other filter changes immediately
  const handleChange = useCallback(
    (field, value) => {
      const updates = { [field]: value }
      setFilterBy((prev) => ({ ...prev, ...updates }))
      updateFilter(updates)
    },
    [updateFilter]
  )

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedTextSearch.cancel()
    }
  }, [debouncedTextSearch])

  return (
    <section className="toy-filter">
      <input
        type="text"
        placeholder="Search toy name..."
        value={filterBy.txt}
        onChange={(e) => handleTextChange(e.target.value)}
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
})
