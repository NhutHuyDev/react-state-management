export function getPageQuery(): { page: number } {
    const queryString = window.location.search;

    const params = new URLSearchParams(queryString);

    const currentPage = Number(params.get('page'));

    if (isNaN(currentPage) || currentPage <= 0) {
        setPageQuery(1)
        return {
            page: 1
        }
    } else {
        return {
            page: currentPage
        }
    }
}

export const setPageQuery = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString())
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, "", newUrl)
}

export const calculateTotalPages = (n: number, itemsPerPage: number = 16): number => {
    if (n <= 0) return 1;
    return Math.ceil(n / itemsPerPage);
};