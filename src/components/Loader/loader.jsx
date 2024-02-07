import React from 'react'
import { SyncLoader } from "react-spinners";

const Loader = () => {
    return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <SyncLoader color="#fab437" />
        </div>
      );
}

export default Loader;