import { combineReducers, configureStore, createSelector } from '@reduxjs/toolkit'
import { pokemonApi } from './services/pokemon'
import { searchSlice } from './slices/search';
import { calculateTotalPages } from './pagination';
import { paginationSlice } from './slices/pagination';

export interface Pokemon {
    id: number;
    name: string;
    type: string[];
    hp: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
}

const filteredPokemon = (pokemon: Pokemon[], search: string) =>
    pokemon.filter((p: Pokemon) => p.name.toLowerCase().includes(search))

const paginatedPokemon = (pokemon: Pokemon[], page: number) =>
    pokemon.slice(0 + (page - 1) * 16, (page - 1) * 16 + 16)

const sortedPokemon = (pokemon: Pokemon[]) =>
    pokemon.sort((a: Pokemon, b: Pokemon) => a.name.localeCompare(b.name))

const rootReducer = combineReducers({
    [searchSlice.name]: searchSlice.reducer,
    [paginationSlice.name]: paginationSlice.reducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokemonApi.middleware),
})

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof store.getState>

store.dispatch(pokemonApi.endpoints.getPokemon.initiate());

export const selectPokemon = createSelector(
    (state: RootState) =>
        pokemonApi.endpoints.getPokemon.select()(state),
    (state: RootState) => state.search.search,
    (state: RootState) => state.pagination.page,
    (getPokemon, search, page) => {
        const {data, isLoading} = getPokemon

        const pokemon = data ? data : []
        const filtered = filteredPokemon(pokemon, search)
        const total = filtered.length
        const totalPages = calculateTotalPages(total)

        return {
            total: total,
            pokemon: sortedPokemon(paginatedPokemon(filtered, page)),
            loaded: !isLoading,
            totalPages: totalPages
        }
    }
);

// type PokemonState = {
//     pokemon: Pokemon[],
//     loaded: boolean,
//     total: number,
//     totalPages: number,
//     page: number,
//     search: string,
// }

// type PokemonAction = { type: "SET_LOADING" } | { type: "SET_POKEMON", payload: Pokemon[] } | { type: "SET_SEARCH", payload: string } | { type: "SET_TOTAL", payload: number } | { type: "SET_TOTAL_PAGES", payload: number } | { type: "SET_PAGE", payload: number }

// const calculateTotalPages = (n: number, itemsPerPage: number = 16): number => {
//     if (n <= 0) return 1;
//     return Math.ceil(n / itemsPerPage);
// };

// function usePokemonSource(): {
//     pokemon: Pokemon[],
//     loaded: boolean
//     total: number,
//     totalPages: number,
//     page: number,
//     search: string,
//     setSearch: (search: string) => void,
//     setPageInit: () => void,
//     setPageState: (page: number) => void,
//     nextPage: (page: number, totalPages: number) => void
// } {
//     const [{ pokemon, loaded, search, total, totalPages, page }, dispatch] = useReducer((state: PokemonState, action: PokemonAction): PokemonState => {
//         switch (action.type) {
//             case "SET_LOADING":
//                 return { ...state, loaded: false }
//             case "SET_POKEMON":
//                 return { ...state, pokemon: action.payload, loaded: true }
//             case "SET_SEARCH":
//                 return { ...state, search: action.payload }
//             case "SET_TOTAL":
//                 return { ...state, total: action.payload }
//             case "SET_TOTAL_PAGES":
//                 return { ...state, totalPages: action.payload }
//             case "SET_PAGE":
//                 return { ...state, page: action.payload }
//             default:
//                 return { ...state }
//         }
//     }, {
//         pokemon: [],
//         loaded: false,
//         search: "",
//         page: getPageQuery().page,
//         totalPages: 0,
//         total: 0
//     })

//     useEffect(() =>  {
//         fetch("/pokemon.json")
//             .then(res => res.json())
//             .then(data =>  dispatch({
//                 type: "SET_POKEMON",
//                 payload: data
//             }))
//     }, [])


//     const setSearch = useCallback((search: string) => {
//         dispatch({
//             type: "SET_SEARCH",
//             payload: search
//         })
//     }, [])

//     const setPageInit = useCallback(() => {
//         dispatch({
//             type: "SET_PAGE",
//             payload: 1
//         })

//         setPageQuery(1)
//     }, [])

//     const setPageState = useCallback((page: number) => {
//         dispatch({
//             type: "SET_PAGE",
//             payload: page
//         })
//     }, [])

//     const nextPage = useCallback((page: number, totalPages: number) => {
//         if (page + 1 > totalPages) {
//             dispatch({
//                 type: "SET_PAGE",
//                 payload: 1
//             })

//             setPageQuery(1)
//         } else {
//             dispatch({
//                 type: "SET_PAGE",
//                 payload: page + 1
//             })

//             setPageQuery(page + 1)
//         }
//     }, [])

//     const filteredPokemon = useMemo(() => pokemon.filter(
//         (p: Pokemon) => p.name.toLowerCase().includes(search)), [pokemon, search])

//     useEffect(() => {
//         dispatch({
//             type: "SET_TOTAL",
//             payload: filteredPokemon.length
//         })

//         dispatch({
//             type: "SET_TOTAL_PAGES",
//             payload: calculateTotalPages(filteredPokemon.length)
//         })
//     }, [filteredPokemon])

//     const paginatedPokemon = useMemo(() => {
//         return filteredPokemon.slice(0 + (page - 1) * 16, (page - 1) * 16 + 16)
//     }, [pokemon, search, page])

//     const sortedPokemon = useMemo(() => {
//         return paginatedPokemon.sort((a: Pokemon, b: Pokemon) => a.name.localeCompare(b.name))
//     }, [paginatedPokemon])

//     return { pokemon: sortedPokemon, loaded: loaded, search, total, totalPages, page, setSearch, nextPage, setPageInit, setPageState }
// }

// export function usePokemon() {
//     return useContext(PokemonContext)
// }

// const PokemonContext = createContext<ReturnType<typeof usePokemonSource>>(
//     {} as unknown as ReturnType<typeof usePokemonSource>)

// export function PokemonProvider({ children }: { children: React.ReactNode }) {
//     return (
//         <PokemonContext.Provider value={usePokemonSource()} >
//             {children}
//         </PokemonContext.Provider>
//     )
// }