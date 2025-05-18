import { Link } from 'react-router-dom'

export function ToyPreview({ toy, onRemove }) {
  return (
    <article className="toy-preview">
      <img src={toy.imgUrl} alt={toy.name} />
      <h2>{toy.name}</h2>
      <p>Price: ${toy.price}</p>
      <p>Labels: {toy.labels.join(', ')}</p>
      <p>{toy.inStock ? 'In Stock' : 'Out of Stock'}</p>
      <div className="actions">
        <Link to={`/toy/${toy._id}`}>Details</Link>
        <Link to={`/toy/edit/${toy._id}`}>Edit</Link>
        <button onClick={() => onRemove(toy._id)}>Remove</button>
      </div>
    </article>
  )
}
