import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { saveToy } from '../store/toy.slice'
import { toyService } from '../services/toy.service'

export function ToyEdit() {
  const [toy, setToy] = useState({
    name: '',
    price: '',
    labels: [],
    inStock: true,
    imgUrl: 'https://example.com/toy.jpg', // Default image
    createdAt: Date.now(), // Add createdAt for new toys
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null) // Add error state
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { toyId } = useParams()
  const storeError = useSelector((state) => state.toyModule.error)

  useEffect(() => {
    if (toyId) loadToy()
  }, [toyId])

  useEffect(() => {
    // Update local error state if store error changes
    if (storeError) setError(storeError)
  }, [storeError])

  async function loadToy() {
    try {
      setIsLoading(true)
      setError(null)
      const toy = await toyService.getById(toyId)
      setToy(toy)
    } catch (err) {
      console.error('Failed to load toy:', err)
      setError(err.message)
      navigate('/toy')
    } finally {
      setIsLoading(false)
    }
  }

  function handleChange(ev) {
    const { name, value, type, checked } = ev.target
    let fieldValue = type === 'checkbox' ? checked : value

    if (name === 'price') {
      fieldValue = value === '' ? '' : Number(value)
    }

    if (name === 'labels') {
      const selectedOptions = Array.from(
        ev.target.selectedOptions,
        (option) => option.value
      )
      fieldValue = selectedOptions
    }

    setToy((prevToy) => ({
      ...prevToy,
      [name]: fieldValue,
    }))
  }

  async function onSaveToy(ev) {
    ev.preventDefault()
    try {
      setIsLoading(true)
      setError(null)

      // Validate required fields
      if (!toy.name.trim()) throw new Error('Name is required')
      if (toy.price === '' || isNaN(toy.price))
        throw new Error('Valid price is required')
      if (!Array.isArray(toy.labels)) throw new Error('Labels must be an array')

      // Ensure all fields are of correct type
      const toyToSave = {
        ...toy,
        price: Number(toy.price),
        inStock: Boolean(toy.inStock),
        createdAt: toy.createdAt || Date.now(),
      }

      console.log('Saving toy:', toyToSave) // Debug log
      const result = await dispatch(saveToy(toyToSave)).unwrap()
      console.log('Save result:', result) // Debug log
      navigate('/toy')
    } catch (err) {
      console.error('Failed to save toy:', err)
      setError(err.message || 'Failed to save toy')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <section className="toy-edit">
      <h2>{toyId ? 'Edit Toy' : 'Add Toy'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={onSaveToy}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={toy.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={toy.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imgUrl">Image URL:</label>
          <input
            type="text"
            id="imgUrl"
            name="imgUrl"
            value={toy.imgUrl}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="labels">Labels:</label>
          <select
            multiple
            id="labels"
            name="labels"
            value={toy.labels}
            onChange={handleChange}
          >
            {toyService.getLabels().map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="inStock"
              checked={toy.inStock}
              onChange={handleChange}
            />
            In Stock
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => navigate('/toy')}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}
