export interface Ingredients {
    id: number
    name_de: string
    name_en: string
    amount: number
    unit_de: string
    unit_en: string
    position: number
}

export interface Step {
    id: number
    step_number: number
    instruction_de: string
    instruction_en: string
}

export interface Recipe {
    id?: number
    type: 'original' | 'fusion'
    title_de: string
    title_en: string
    description_de: string
    description_en: string
    image_url: string | undefined
    origin_country_de: string | null
    origin_country_en: string | null
    origin_region: string | null
    ingredients: Ingredients[]
    steps: Step[]
    prep_time: number
    cook_time: number
    servings: number
    difficulty: 'easy' | 'medium' | 'hard'
}
