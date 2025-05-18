import { memo } from 'react'
import { ToyPreview } from './ToyPreview'

export const ToyList = memo(function ToyList({ toys, onRemove }) {
  if (!toys.length) return <div>No toys found</div>

  return (
    <section className="toy-list">
      {toys.map((toy) => (
        <ToyPreview key={toy._id} toy={toy} onRemove={onRemove} />
      ))}
    </section>
  )
})
