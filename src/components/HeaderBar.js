export default function HeaderBar({ selectedWindow }) {
    return <div className="w-full bg-[rgba(0,0,0,0.5)] flex justify-between items-center h-8 px-2 cursor-default border-b border-[rgba(0,0,0,0.15)] z-[9999]">
        <p>{selectedWindow?.[0]?.title || " "}</p>
    </div>
}