export interface Ingredients {
    id: number
    name: string
    amount: number
    unit: string
    position: number
}

export interface Step {
    id: number
    step_number: number
    instruction: string
}

export interface Recipe {
    id: number
    type: 'original' | 'fusion'
    title: string
    description: string
    image_url: string | undefined
    origin_country: string | null
    origin_region: string | null
    ingredients: Ingredients[]
    steps: Step[]
    prep_time: number
    cook_time: number
    servings: number
    difficulty: 'easy' | 'medium' | 'hard'
}