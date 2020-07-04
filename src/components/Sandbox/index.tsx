import Board from "../Board";
import { Client } from "boardgame.io/react";
import React from "react";
import { game } from "../../logic/game";

const SandboxClient = Client({ game, board: Board });

/** Render a sandbox game. */
const Sandbox = () => (
  <div id="sandbox">
    <SandboxClient />
  </div>
);

export default Sandbox;