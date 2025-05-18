import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toyService } from '../services/toy.service'

export function ToyDetails() {
  const [toy, setToy] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [showChat, setShowChat] = useState(false)
  const { toyId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadToy()
  }, [toyId])

  async function loadToy() {
    try {
      const toy = await toyService.getById(toyId)
      setToy(toy)
    } catch (err) {
      console.error('Failed to load toy:', err)
      navigate('/toy')
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmitMessage(ev) {
    ev.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      text: newMessage,
      sender: 'user',
      timestamp: Date.now(),
    }

    setChatMessages((prev) => [...prev, message])
    setNewMessage('')

    // Auto response after 1 second
    setTimeout(() => {
      const response = {
        text: 'Thank you for your message! We will get back to you soon.',
        sender: 'system',
        timestamp: Date.now(),
      }
      setChatMessages((prev) => [...prev, response])
    }, 1000)
  }

  if (isLoading) return <div>Loading...</div>
  if (!toy) return <div>Toy not found</div>

  return (
    <section className="toy-details">
      <h2>{toy.name}</h2>
      <img src={toy.imgUrl} alt={toy.name} />
      <p>Price: ${toy.price}</p>
      <p>Labels: {toy.labels.join(', ')}</p>
      <p>{toy.inStock ? 'In Stock' : 'Out of Stock'}</p>
      <p>Created: {new Date(toy.createdAt).toLocaleDateString()}</p>

      <button className="chat-toggle" onClick={() => setShowChat(!showChat)}>
        💬 Chat
      </button>

      {showChat && (
        <div className="chat-popup">
          <header>
            <h3>Chat about {toy.name}</h3>
            <button onClick={() => setShowChat(false)}>×</button>
          </header>

          <main className="chat-messages">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                <p>{msg.text}</p>
                <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
              </div>
            ))}
          </main>

          <footer>
            <form onSubmit={handleSubmitMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button type="submit">Send</button>
            </form>
          </footer>
        </div>
      )}
    </section>
  )
}
