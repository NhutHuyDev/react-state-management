// import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
// import { getPageQuery, setPageQuery } from "./pagination";
import { proxy } from "valtio";
import { watch } from 'valtio/utils';
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

export const search = proxy({
    pokemon_name: "",
});

export const pagination = proxy({
    totalPages: 0,
    page: getPageQuery().page
});

export const allPokemon = proxy({
    all: [] as Pokemon[],    
})

export const pokemon = proxy({
    loaded: false,
    total: 0
});
export let pokemonList : Pokemon[] = []

const filteredPokemon = (pokemon: Pokemon[], search: string) =>
    pokemon.filter((p: Pokemon) => p.name.toLowerCase().includes(search))

const paginatedPokemon = (pokemon: Pokemon[], page: number) =>
    pokemon.slice(0 + (page - 1) * 16, (page - 1) * 16 + 16)

const sortedPokemon = (pokemon: Pokemon[]) => 
    pokemon.sort((a: Pokemon, b: Pokemon) => a.name.localeCompare(b.name))

watch((get) => {

    const { loaded } = get(pokemon)

    if (loaded) {
        const { all } = get(allPokemon)
        const { pokemon_name } = get(search)
        const { page } = get(pagination)

        const filtered = filteredPokemon(all, pokemon_name)
        pokemonList = sortedPokemon(paginatedPokemon(filtered, page))
        pokemon.total = filtered.length
        pagination.totalPages = calculateTotalPages(filtered.length)
    }
})

watch((get) => {
    const { page } = get(pagination)
    const { all } = get(allPokemon)
    const { pokemon_name } = get(search)

    const filtered = filteredPokemon(all, pokemon_name)
    pokemonList = sortedPokemon(paginatedPokemon(filtered, page))
})

export const nextPage = (page: number, totalPages: number) => {
    if (page + 1 > totalPages) {
        pagination.page = 1
        setPageQuery(1)
    } else {
        pagination.page = page + 1
        setPageQuery(page + 1)
    }
}

export const setPageInit = () => {
    pagination.page = 1
    setPageQuery(1)
}

export const setPageState = (page: number) => {
    pagination.page = page
}

pokemon.loaded = false
fetch("/pokemon.json")
    .then((res) => res.json())
    .then((data) => {
        allPokemon.all = data;
        pokemon.loaded = true
    });

