import { BrowserRouter, Routes, Route } from "react-router-dom"
import FeedPage from './pages/FeedPage'
import Layout from './components/Layout'
import RecipeDetailPage from "./pages/RecipeDetailPage"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<FeedPage />} />
        </Route>
        <Route path='/recipes/:id' element={<RecipeDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
