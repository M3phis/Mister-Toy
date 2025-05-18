import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { HomePage } from './pages/HomePage'
import { ToyIndex } from './pages/ToyIndex'
import { ToyDetails } from './pages/ToyDetails'
import { ToyEdit } from './pages/ToyEdit'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <main>
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/toy" element={<ToyIndex />} />
              <Route path="/toy/:toyId" element={<ToyDetails />} />
              <Route path="/toy/edit/:toyId?" element={<ToyEdit />} />
              <Route path="/" element={<Navigate to="/home" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  )
}

export default App
