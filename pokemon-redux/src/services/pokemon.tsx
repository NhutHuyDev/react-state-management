import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Pokemon } from '../store'

export const pokemonApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    endpoints: (builder) => ({
        getPokemon: builder.query<Pokemon[], void>({
            query: () => `pokemon.json`,
        }),
    }),
})

export const { useGetPokemonQuery } = pokemonApi
