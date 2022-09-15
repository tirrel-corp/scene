import { allyShip, deSig } from '@urbit/api';
import { useState } from 'react';
import ob from 'urbit-ob';
import { api } from '../../state/api';

export default function Search({ allies, treaties }) {
    const [query, setQuery] = useState("");
    const [promptOpen, setPromptOpen] = useState(false);

    return <div className="relative w-full max-w-md flex items-center justify-center"><input
        type="text"
        placeholder="Search for providers..."
        className="rounded-xl my-4 p-1"
        onFocus={() => setPromptOpen(true)}
        onBlur={() => setPromptOpen(false)}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                if (ob.isValidPatp(query)) {
                    api.poke(allyShip(`~${deSig(query)}`));
                }
            }
        }}
        value={query}
    />
        {promptOpen && <div className="bg-white absolute top-14 self-center w-full rounded-xl shadow-md shadow-[rgba(0,0,0,0.1)] p-4 flex justify-center items-center min-h-[200px]">
            {query === "" && <p className="text-gray-500 text-xs p-4">Please enter a valid <code>@p</code> to search for applications.</p>}
        </div>}
    </div>
}