import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loadToys, removeToy } from '../store/toy.slice'
import { selectToyState } from '../store/toy.selectors'
import { ToyList } from '../components/ToyList'
import { ToyFilter } from '../components/ToyFilter'

export function ToyIndex() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toys, isLoading, error } = useSelector(selectToyState)

  useEffect(() => {
    dispatch(loadToys())
  }, [dispatch])

  const onRemoveToy = useCallback(
    async (toyId) => {
      try {
        await dispatch(removeToy(toyId)).unwrap()
      } catch (err) {
        console.error('Failed to remove toy:', err)
      }
    },
    [dispatch]
  )

  const onAddToy = useCallback(() => {
    navigate('/toy/edit')
  }, [navigate])

  if (error) return <div>Error: {error}</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <main className="toy-index">
      <header className="toy-index-header">
        <h1>Our Toys</h1>
        <button onClick={onAddToy}>Add Toy</button>
      </header>

      <ToyFilter />
      <ToyList toys={toys} onRemove={onRemoveToy} />
    </main>
  )
}
