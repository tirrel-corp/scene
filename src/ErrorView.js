import React from "react";
import { useRouteError } from "react-router-dom";
import { clearAuth } from "./lib/auth";

export default function ErrorBoundary(props) {
  const error = useRouteError();
  return (
    <article
      id="error-view"
      className="bg-black text-gray flex flex-col justify-center items-center"
      style={{
        minWidth: "100vw",
        maxWidth: "100vw",
        width: "100vw",
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('tirrel-mark.svg'), url('scene-large-stroke.svg')",
        backgroundSize: "cover, auto, calc(max(25vw, 340px))",
        backgroundPosition: "center, bottom 2vh center, center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="flex flex-col p-6 rounded-lg bg-[#DDD]"
        style={{ maxWidth: "70ch", gap: "1rem" }}
      >
        <h1 className="text-xl">Something's gone wrong.</h1>
        {error?.message && (
          <>
            <p>Some more details on the error:</p>
            <p className="p-3 br3 bg-[#DDDA] font-mono">{error?.message}</p>
          </>
        )}
        <p>Please quit and restart Scene.</p>
        <p>
          If you've run into this issue repeatedly, you can use the button below
          to reset the app to a clean state. And we're always available to help
          at&nbsp;
          <a className="underline" href="mailto:support@tirrel.io">
            support@tirrel.io
          </a>
          .
        </p>
        <div className="flex justify-end">
          <button
            onClick={clearAuth}
            className="text-red bold"
            style={{ color: "red", paddingInline: "2rem" }}
          >
            Reset Scene
          </button>
        </div>
      </div>
    </article>
  );
}
