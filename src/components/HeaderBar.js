export default function HeaderBar({ selectedWindow }) {
    return <div className="text-white w-full bg-[rgba(0,0,0,0.5)] flex justify-between items-center h-9 px-4 cursor-default border-b border-[rgba(0,0,0,0.15)] z-[9999]">
        <p className="p-1 rounded-lg hover:bg-[rgba(255,255,255,0.1)]">{selectedWindow?.[0]?.title || " "}</p>
    </div>
}