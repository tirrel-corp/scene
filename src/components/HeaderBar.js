export default function HeaderBar({ selectedWindow }) {
    return <div className="w-full bg-[rgba(0,0,0,0.2)] flex justify-between items-center h-8 px-2 cursor-default">
        <p>{selectedWindow.title || " "}</p>
    </div>
}