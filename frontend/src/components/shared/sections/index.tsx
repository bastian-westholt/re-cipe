import RecipeSection from "./RecipeSection"
import ScrollRow from "./ScrollRow"
import Carousel from "./Carousel"
import Cuisine from "./CuisineSection"

const RecipeSectionWithSubs = Object.assign(RecipeSection, { ScrollRow, Carousel, Cuisine })

export { RecipeSectionWithSubs as RecipeSection }
