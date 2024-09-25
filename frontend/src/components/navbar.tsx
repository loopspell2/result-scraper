
interface NavbarProps {
    setPage: (page: string) => void;
}

export const Navbar = ({ setPage }: NavbarProps) => {

    return (<>
        <div className="bg-neutral-600 px-4 py-.5 rounded-xl flex items-center justify-around  text-center w-[55%]">
            <button
                className="hover:bg-neutral-700 rounded-lg px-2 m-0.5"
                onClick={() => setPage("list")}
            >
                create list
            </button>
            <button
                className="hover:bg-neutral-700 rounded-lg px-2 m-0.5"
                onClick={() => setPage("roll")}
            >
                roll No
            </button>
            <button
                className="hover:bg-neutral-700 rounded-lg px-2 m-0.5"
                onClick={() => setPage("results")}
            >
                results
            </button>
        </div >
    </>)
}