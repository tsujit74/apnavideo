import React from "react";
import BackButton from "./BackButton";

export default function NotFound() {
  return (
    <div className="pageNotFound">
      <BackButton/>
      <div>
        <h2>404 - Page Not Found</h2>
        <img src="\images\pageNotFound.png" alt="pageNotFound" />
      </div>
    </div>
  );
}
