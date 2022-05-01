import {
  html,
  useState,
} from "https://unpkg.com/htm/preact/standalone.module.js";

export default function App({ xsize, length }) {
  const ar = (n) => Array(n).fill(null);
  const cp = (obj) => JSON.parse(JSON.stringify(obj));
  const [winner, setWinner] = useState(null);
  const [matrix, setMatrix] = useState(
    ar(xsize).map((d, i) =>
      ar(xsize).map((d, ii) => ({
        id: xsize * i + ii,
        yPos: i,
        xPos: ii,
        val: null,
        class: "",
      }))
    )
  );
  const [player, setPlayer] = useState("X");
  const [history, setHistory] = useState([cp(matrix)]);

  const style = {
    square: {
      gridTemplateColumns: `repeat(${xsize}, 1fr)`,
    },
    font: { fontSize: `calc(calc(10vw + 10vh) / ${xsize})` },
  };

  const checkRange = (items, combo) => {
    const itemsValues = items.map((item) => item.val);
    if (itemsValues.join().includes(combo.join())) {
      const index = itemsValues.join().indexOf(combo.join());
      ar(length).forEach((d, i) => (items[i + index].class = "win"));
      setWinner(player);
      return true;
    }
  };

  const perpendicular = ({ xPos, yPos, d }) => {
    let result = [];
    let xStart, xEnd, yStart, yEnd;
    xStart = xEnd = xPos;
    yStart = yEnd = yPos;
    for (var l = length - 1; l > 0; l--) {
      if (d == "h") if (xStart > 0) xStart--;
      if (d == "h") if (xEnd < xsize - 1) xEnd++;
      if (d == "v") if (yStart > 0) yStart--;
      if (d == "v") if (yEnd < xsize - 1) yEnd++;
    }
    const range = d == "h" ? xEnd - xStart : yEnd - yStart;
    for (let n = 0; n <= Math.abs(range); n++) {
      if (d == "h") result.push(matrix[yPos][xStart + n]);
      if (d == "v") result.push(matrix[yStart + n][xPos]);
    }
    return result;
  };

  const diagonal = ({ xPos, yPos, d }) => {
    let result = [];
    let xStart, xEnd, yStart, yEnd;
    xStart = xEnd = xPos;
    yStart = yEnd = yPos;
    for (var l = length - 1; l > 0; l--) {
      if (d == "l") {
        if (xStart > 0 && yStart > 0) {
          xStart--;
          yStart--;
        }
        if (xEnd < xsize - 1 && yEnd < xsize - 1) {
          xEnd++;
          yEnd++;
        }
      }
      if (d == "r") {
        if (xStart > 0 && yStart < xsize - 1) {
          xStart--;
          yStart++;
        }
        if (xEnd < xsize - 1 && yEnd > 0) {
          xEnd++;
          yEnd--;
        }
      }
    }
    const range = d == "l" ? xEnd - xStart : yStart - yEnd;
    for (let n = 0; n <= Math.abs(range); n++) {
      if (d == "l") result.push(matrix[yStart + n][xStart + n]);
      if (d == "r") result.push(matrix[yStart - n][xStart + n]);
    }
    return result;
  };

  const hasWon = (el) => {
    let items;
    const combo = ar(length).map(() => player);
    const { xPos, yPos } = el;
    // Horizontal
    items = perpendicular({ xPos, yPos, d: "h" });
    if (checkRange(items, combo)) return;
    // vertical
    items = perpendicular({ xPos, yPos, d: "v" });
    if (checkRange(items, combo)) return;
    // diagonal from left
    items = diagonal({ xPos, yPos, d: "l" });
    if (checkRange(items, combo)) return;
    // diagonal from right
    items = diagonal({ xPos, yPos, d: "r" });
    if (checkRange(items, combo)) return;
  };

  const handleClick = (el) => (e) => {
    if (el.val || winner) return;
    setPlayer(player == "X" ? "O" : "X");
    el.val = player;
    setHistory([...history, cp(matrix)]);
    hasWon(el);
  };

  const handleBack = (i) => (e) => {
    e.preventDefault();
    setMatrix([...history[i]]);
    history.splice(i + 1);
    setHistory([...history]);
    setPlayer(i % 2 === 0 ? "X" : "O");
    setWinner(null);
  };

  return html`
    <img
      src="https://preactjs.com/assets/app-icon.png"
      width="50"
      alt="Preact logo"
    />
    <h1>PRE AC TOE</h1>
    <p>
      The game takes 2 parameters in URL:<br />
      <b>xsize</b> - (number of fields on axis) and <b>length</b> - (number of
      consecutive fields needed to win).<br />
      Try <a href="/?xsize=10&length=4">this board size</a> for a more complex
      game.
    </p>
    ${!winner
      ? html`<h2>Next player: ${player}</h2>`
      : html`<h2>Winner is player ${winner}</h2>`}
    <div class="tictactoe" style=${{ ...style.square }}>
      ${matrix
        .flat()
        .map(
          (el) => html`
            <div
              id="s${el.id}"
              class=${"square " + el.class}
              style=${{ ...style.font }}
              onclick=${handleClick(el)}
            >
              ${el.val}
            </div>
          `
        )}
    </div>
    <h3>History</h3>
    <ul class="historyList">
      ${history.length < 2
        ? null
        : history.map((el, i) =>
            i == history.length - 1
              ? null
              : html`
                  <li>
                    <a href="#" onclick=${handleBack(i)}>Back to move ${i}</a>
                  </li>
                `
          )}
    </ul>
    <a
      class="github-fork-ribbon"
      href="https://github.com/brdavs/pre-ac-toe"
      data-ribbon="Fork me on GitHub"
      title="Fork me on GitHub"
      >Fork me on GitHub</a
    >
  `;
}
