import { useNavigate } from 'react-router-dom'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <div className="hero-content">
        <h1>Welcome to MisterToy</h1>
        <p>Discover our amazing collection of toys for all ages!</p>
        <img
          src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=2070&auto=format&fit=crop"
          alt="Colorful toys"
          className="hero-image"
        />
        <button className="cta-button" onClick={() => navigate('/toy')}>
          Explore Our Toys
        </button>
      </div>
    </div>
  )
}
