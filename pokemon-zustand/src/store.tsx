import { create } from "zustand";
import { calculateTotalPages, getPageQuery, setPageQuery } from "./pagination";

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

export const usePokemon = create<{
    allPokemon: Pokemon[]
    pokemon: Pokemon[],
    loaded: boolean
    total: number,
    totalPages: number,
    page: number,
    search: string,
    setLoading: () => void,
    setAllPokemon: (data: Pokemon[]) => void,
    setSearch: (search: string) => void,
    setPageInit: () => void,
    setPageState: (page: number) => void,
    paginate: (page: number) => void,
    nextPage: (page: number, totalPages: number) => void
}>((set, get) => ({
    pokemon: [],
    allPokemon: [],
    loaded: false,
    total: 0,
    totalPages: 0,
    page: getPageQuery().page,
    search: "",
    setLoading: () => set({ loaded: false }),
    setAllPokemon: (data: Pokemon[]) => {
        const filtered = filteredPokemon(data, get().search)
        const pokemon = sortedPokemon(paginatedPokemon(filtered, 1))
        const total = filtered.length
        const totalPages = calculateTotalPages(total)
        set({
            allPokemon: data,
            pokemon: pokemon,
            loaded: true,
            total: total,
            totalPages: totalPages
        })
    },
    setSearch: (search: string) => {
        const filtered = filteredPokemon(get().allPokemon, search)
        const pokemon = sortedPokemon(paginatedPokemon(filtered, 1))
        const total = filtered.length
        const totalPages = calculateTotalPages(total)
        set({ search, pokemon, total, totalPages })
        set({ page: 1 })
        setPageQuery(1)
    },
    setPageInit: () => {
        set({ page: 1 })
        setPageQuery(1)
    },
    setPageState: (page: number) => {
        set({ page: page })
    },
    paginate: (page: number) => {
        const filtered = filteredPokemon(get().allPokemon, get().search)
        const pokemon = sortedPokemon(paginatedPokemon(filtered, page))
        set({
            pokemon: pokemon,
        })
    },
    nextPage: (page: number, totalPages: number) => {
        if (page + 1 > totalPages) {
            const filtered = filteredPokemon(get().allPokemon, get().search)
            const pokemon = sortedPokemon(paginatedPokemon(filtered, 1))
            set({ pokemon })
            set({ page: 1 })
            setPageQuery(1)
        } else {
            const filtered = filteredPokemon(get().allPokemon, get().search)
            const pokemon = sortedPokemon(paginatedPokemon(filtered, page + 1))
            set({ pokemon })
            set({ page: page + 1 })
            setPageQuery(page + 1)
        }
    }
}));

usePokemon.getState().setLoading();
fetch("/pokemon.json")
    .then((response) => response.json())
    .then((pokemon) => {
        usePokemon.getState().setAllPokemon(pokemon);
    });