export default function HeaderBar({ selectedWindow }) {
  return (
    <div className="w-full bg-[rgba(0,0,0,0.2)] flex justify-between items-center px-2 py-1 cursor-default">
      <p>{selectedWindow.title || " "}</p>
      <button className="text-white flex">
        <svg width="15" height="18" className="icon inline">
          <use href="/icons.svg#bell" />
        </svg>
      </button>
    </div>
  )
}
