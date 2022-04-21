import { html, useState, useEffect } from 'https://unpkg.com/htm/preact/standalone.module.js'


export default function App({x, z}) {
  const ar = n => Array(n).fill(null)
  const [winner, setWinner] = useState(null)
  const [board, setBoard] = useState(ar(x*x))
  const [player, setPlayer] = useState('X')
  const [history, setHistory] = useState([[...board]])

  const style = {
    square: {
      gridTemplateColumns: `repeat(${x}, 1fr)`
    }
  }


const getRange = pos => [...new Set(ar(z+z-1).map((d,i)=> Math.min(x-1, Math.max(0, pos-z+1)+i)))]

const hasWon = id => {
  let items = []
  const combo = ar(3).map(() => player)
  const matrix = ar(x).map((d,i) => ar(x).map((d,ii) => ({id: x*i+ii, yPos:i, xPos:ii, val: board[x*i+ii]})))
  const {xPos, yPos} = matrix.flat().find(el => el.id == id)
  const xRange = getRange(xPos)
  const yRange = getRange(yPos)
  console.log(xRange, yRange, Math.min(xRange.length, yRange.length))
  // Horizontal
  items = xRange.map(xD => matrix[yPos][xD].val)
  if (items.join().includes(combo.join())) {
    setWinner(player)
    return
  }
  // vertical
  items = yRange.map(yD => matrix[yD][xPos].val)
  if (items.join().includes(combo.join())) {
    setWinner(player)
    return
  }
  // diagonal 1
  let shortest = Math.min(xRange.length, yRange.length)
  items = ar(shortest).map((d, i) => matrix[yRange[i]][xRange[i]].val)
  if (items.join().includes(combo.join())) {
    setWinner(player)
    return
  }
}

  const handleClick = id => e => {
    if (board[id] || winner ) return
    setPlayer(player=='X' ? 'O' : 'X')
    board.splice(id, 1, player)
    setBoard([...board])
    setHistory([...history, [...board]])
    hasWon(id)
  }

  const handleBack = i => e => {
    e.preventDefault()
    console.log(i)
    setBoard([...history[i]])
    history.splice(i+1)
    setHistory([...history])
    setPlayer(i % 2 === 0 ? 'X' : 'O')
    setWinner(null)
  }

  return html`
    <h1>RE AC TOE</h1>
    ${!winner
      ? html`<h2>Next player: ${player}</h2>`
      : html`<h2>Winner is player ${winner}</h2>`
    }
    <div class="tictactoe" style=${{...style.square}}>
      ${board.map((y,i) => html`
        <div class="square" id=s${i} onclick=${handleClick(i)}>
          ${board[i]}
        </div>
      `)}
    </div>
    <h3>History</h3>
    <ul class="historyList">
      ${history.length<2 ? null : history.map((item, i) => i==history.length-1 ? null : html`
        <li>
          <a href="#" onclick=${handleBack(i)}>Back to move ${i}</a>
        </li>
      `)}
    </ul>
  `
}