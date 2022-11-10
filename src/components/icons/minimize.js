export default function MinimizeIcon({ ...rest }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle cx="8" cy="8" r="8" fill="var(--minimize-icon-bg, black)" />
      <path
        d="M3.83333 7H12.1667C12.625 7 13 7.45 13 8C13 8.55 12.625 9 12.1667 9H3.83333C3.375 9 3 8.55 3 8C3 7.45 3.375 7 3.83333 7Z"
        fill="var(--minimize-icon-fg, white)"
      />
    </svg>
  );
}
