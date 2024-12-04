import { useSnapshot } from "valtio";
import { nextPage, pagination, pokemon, pokemonList, search, setPageInit, setPageState } from "./store";
import { useEffect } from "react";
import { getPageQuery } from "./pagination";

function SearchBox() {
  const searchSnap = useSnapshot(search);

  return (
    <input
      className="mt-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-800 focus:ring-indigo-800 sm:text-lg p-2"
      placeholder="Search"
      value={searchSnap.pokemon_name}
      onChange={(e) => {
        search.pokemon_name = e.target.value;
      }}
    />
  );
}

function PokemonList() {
  const { loaded, total } = useSnapshot(pokemon);
  const { page, totalPages } = useSnapshot(pagination);

  useEffect(() => {
    if (totalPages < page && loaded) {
      setPageInit()
    }
  }, [page, totalPages])

  useEffect(() => {
    const handleQueryChange = () => {
      const { page } = getPageQuery()
      console.log(page)
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
        {pokemonList.map((p) => (
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
