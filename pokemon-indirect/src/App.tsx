import { useEffect } from "react";
import { usePokemon, PokemonProvider } from "./store"
import { getPageQuery } from "./pagination";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function SearchBox() {
  const { search, setSearch } = usePokemon()

  return (
    <input
      className="mt-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-800 focus:ring-indigo-800 sm:text-lg p-2"
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

function PokemonList() {
  const { pokemon, loaded, total, page, totalPages, nextPage, setPageInit } = usePokemon()

  useEffect(() => {
    if (totalPages < page && loaded) {
      console.log(totalPages, "hello", loaded)
      setPageInit()
    }
  }, [page, totalPages])

  const { setPageState } = usePokemon()

  useEffect(() => {
    const handleQueryChange = () => {
      const { page } = getPageQuery()
      setPageState(page)
    };

    window.addEventListener("popstate", handleQueryChange);

    handleQueryChange();

    return () => {
      window.removeEventListener("popstate", handleQueryChange);
    };
  }, []);

  return (
    <>
      <div className="my-2 flex justify-between">
        <div className="text-gray-700 italic cursor-pointer" onClick={() => { nextPage(page, totalPages) }}>Next - <span className="text-gray-500">{page}/{totalPages}</span></div>
        <div className="text-gray-500 italic">Total {total}</div>
      </div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-3">
        {pokemon.map((p) => (
          <li
            key={p.id}
            className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200"
          >
            <div className="flex-1 flex flex-col p-8">
              <img
                className="w-32 h-32 flex-shrink-0 mx-auto bg-black rounded-full"
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                alt=""
              />
              <h3 className="mt-6 text-gray-900 text-sm font-medium">{p.name}</h3>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto max-w-4xl">
        <PokemonProvider>
          <SearchBox />
          <PokemonList />
        </PokemonProvider>
      </div>
    </QueryClientProvider>

  )
}

export default App
