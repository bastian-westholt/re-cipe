import { BrowserRouter, Routes, Route } from "react-router-dom"
import FeedPage from './pages/FeedPage'
import Layout from './components/Layout'
import RecipeDetailPage from "./pages/RecipeDetailPage"
import FusionCreatorPage from "./pages/FusionCreatorPage"
import RecipePickerPage from "./pages/RecipePickerPage"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<FeedPage />} />
        </Route>
        <Route path="/fusion/pick" element={<Layout />}>
          <Route index element={<RecipePickerPage />} />
        </Route>
        <Route path='/recipes/:id' element={<RecipeDetailPage />} />
        <Route path='/fusion/:id?' element={<FusionCreatorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
