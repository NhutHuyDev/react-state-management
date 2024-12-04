import { Provider, useDispatch, useSelector } from "react-redux";
import { selectSearch, setSearch } from "./slices/search";
import { selectPokemon, store } from "./store";
import { paginationSlice, selectPage } from "./slices/pagination";
import { useEffect } from "react";
import { getPageQuery, setPageQuery } from "./pagination";

function SearchBox() {
  const search = useSelector(selectSearch);
  const dispatch = useDispatch();

  return (
    <input
      className="mt-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-800 focus:ring-indigo-800 sm:text-lg p-2"
      placeholder="Search"
      value={search}
      onChange={(e) => {
        dispatch(setSearch(e.target.value));
        dispatch(paginationSlice.actions.setPage(1))
        setPageQuery(1)
      }}
    />
  );
}

function PokemonList() {
  const { pokemon, loaded, total, totalPages } = useSelector(selectPokemon);
  const page = useSelector(selectPage);
  const dispatch = useDispatch();

  useEffect(() => {
    if (totalPages < page && loaded) {
      dispatch(paginationSlice.actions.setPage(1))
      setPageQuery(1)
    }
  }, [page, totalPages])

  useEffect(() => {
    const handleQueryChange = () => {
      const { page } = getPageQuery()
      dispatch(paginationSlice.actions.setPage(page))
    };

    window.addEventListener("popstate", handleQueryChange);

    handleQueryChange();

    return () => {
      window.removeEventListener("popstate", handleQueryChange);
    };
  }, []);

  const nextPage = (page: number, totalPages: number) => {
    if (page + 1 > totalPages) {
      dispatch(paginationSlice.actions.setPage(1))
      setPageQuery(1)
    } else {
      dispatch(paginationSlice.actions.setPage(page + 1))
      setPageQuery(page + 1)
    }
  }

  return (
    <>
      <div className="my-2 flex justify-between">
        <div className="text-gray-700 italic cursor-pointer"
          onClick={() => {nextPage(page, totalPages)}}
        >Next - <span className="text-gray-500">{page}/{totalPages}</span></div>
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


function App() {
  return (
    <Provider store={store}>
      <div className="mx-auto max-w-4xl">
        {/* <PokemonProvider> */}
        <SearchBox />
        <PokemonList />
      </div>
    </Provider>
  )
}

export default App
