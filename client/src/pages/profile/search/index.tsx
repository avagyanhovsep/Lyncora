import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import { Axios } from "../../../api";
import type { IAccount, IContext } from "../../../types";
import SearchHeader from "./components/search-header";
import SearchInputCard from "./components/search-input-card";
import SearchResultsToolbar from "./components/search-results-toolbar";
import SearchResultsCard from "./components/search-results-card";
import SearchUserRow from "./components/search-user-row";

const Search = () => {
    const [users, setUsers] = useState<IAccount[]>([]);
    const { account } = useOutletContext<IContext>();

    const [text, setText] = useState("");
    const query = useDebounce(text, 500);

    useEffect(() => {
        if (!query) return setUsers([]);

        Axios.get<{ users: IAccount[] }>(`/account/search/${query}`).then(
            (response) => {
                const usersList = response.data.users.filter(
                    (user) => user.id !== account.id
                );
                setUsers(usersList);
            }
        );
    }, [query, account.id]);

    const showResults = query.trim().length > 0;

    const leftText = showResults
        ? users.length > 0
            ? `${users.length} result${users.length === 1 ? "" : "s"} found`
            : "No results"
        : "";

    return (
        <div className="w-full px-4 sm:px-6 py-10">
            <div className="mx-auto w-full max-w-5xl">
                <SearchHeader />

                <SearchInputCard value={text} onChange={setText} />

                <div className="mt-6">
                    <SearchResultsToolbar
                        visible={showResults}
                        leftText={leftText}
                        showClear={text.length > 0}
                        onClear={() => setText("")}
                    />

                    <SearchResultsCard
                        showResults={showResults}
                        query={query}
                        hasResults={users.length > 0}
                    >
                        {users.map((user) => (
                            <SearchUserRow key={user.id} user={user} />
                        ))}
                    </SearchResultsCard>
                </div>
            </div>
        </div>
    );
};

export default Search;
