import { useAtom, useAtomValue } from "jotai";
import { Pokemon, searchAtom, sortedPokemonAtom, paginationAtom, pageAtom, allPokemonAtom } from "./store";
import { useEffect } from "react";
import { getPageQuery, setPageQuery } from "./pagination";

function SearchBox() {
  const [search, setSearch] = useAtom(searchAtom);

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
  const [{ isFetched }] = useAtom(allPokemonAtom)
  const pokemon = useAtomValue(sortedPokemonAtom)
  const { totalPages, total } = useAtomValue(paginationAtom)
  const [page, setPage] = useAtom(pageAtom)

  const nextPage = (page: number, totalPages: number) => {
    if (page + 1 > totalPages) {
      setPage(1)
      setPageQuery(1)
    } else {
      setPage(page + 1)
      setPageQuery(page + 1)
    }
  }

  useEffect(() => {
    if (totalPages < page && isFetched) {
      setPage(1)
      setPageQuery(1)
    }
  }, [page, totalPages])

  useEffect(() => {
    const handleQueryChange = () => {
      const { page } = getPageQuery()
      setPage(page)
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
        <div className="text-gray-700 italic cursor-pointer"
          onClick={() => { nextPage(page, totalPages) }}
        >Next - <span className="text-gray-500">{page}/{totalPages}</span></div>
        <div className="text-gray-500 italic">Total {total}</div>
      </div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-3">
        {pokemon.map((p: Pokemon) => (
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

function App() {
  return (
    <div className="mx-auto max-w-4xl">
      <SearchBox />
      <PokemonList />
    </div>
  )
}

export default App
