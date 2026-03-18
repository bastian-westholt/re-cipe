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
          <Route path='/recipes/:id' element={<RecipeDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
