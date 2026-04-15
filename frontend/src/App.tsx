import { BrowserRouter, Routes, Route } from "react-router-dom"
import FeedPage from './pages/FeedPage'
import RecipeDetailPage from "./pages/RecipeDetailPage"
import FusionCreatorPage from "./pages/FusionCreatorPage"
import RecipePicker from "./components/fusion/RecipePicker"
import WalktroughLayout from "./components/layout/WalktroughLayout"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WalktroughLayout />} >
          <Route index element={<FeedPage />} />
          <Route path="/fusion" element={<FusionCreatorPage />} />
        </Route>
        <Route path='/recipes/:id' element={<RecipeDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
