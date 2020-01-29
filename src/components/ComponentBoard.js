import React, { useState, useEffect } from 'react'
import axios from 'axios'

function ComponentSquare(props) {
    return (
        <button className="square" onClick={props.onClick}>{props.value}</button>
    );
}
function ComponentBoard() {
    const initialBoardState = Array(9).fill(null)
    const apiPath = "https://koa-ttt.herokuapp.com/"
    const [boardState, setBoardState] = useState(initialBoardState)
    const [isPersonX, setPersonX] = useState(true)
    const [isGameOver, setGameOver] = useState(false)
    const [isGameOn, setGameOn] = useState(false)
    const [gameWinner, setGameWinner] = useState(null)
    const [userClicks, setUserClicks] = useState(0)
    const [isNextMachine, setIsNextMachine] = useState(false)

    const validWins = () => {
        return [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]
    }
    useEffect(() => {
        if (userClicks == 0) return
        axios({
            method: 'post',
            url: apiPath,
            data: boardState
        }).then(res => {
            setComputersMove(res.data)
        }).catch(err => {
            console.log(err)
        })
    }, [userClicks]);

    const getWinner = (state) => {
        const wins = validWins();
        for (let idx = 0; idx < wins.length; idx++) {
            const [i, j, k] = wins[idx]
            if (state[i] && state[i] === state[j] && state[j] === state[k]) {
                return { "winner": state[i], "winningLine": wins[idx] }
            }
            if (state.every(el => el)) {
                setGameOver(!isGameOver)
            }
        };
    }
    const setUsersMove = (index) => {
        const isInValid = setComputersMove(index)
        if (!isInValid && !isNextMachine) {
            setUserClicks(userClicks + 1)
            setIsNextMachine(true)
        }
    }
    const setComputersMove = (index) => {
        const state = [...boardState]
        if (state[index] || isGameOver || gameWinner) return false

        state[index] = isPersonX ? "X" : "O"

        setGameOn(true)
        setIsNextMachine(false)
        setBoardState(state)
        const winner = getWinner(state)
        setPersonX(!isPersonX)
        if (winner) {
            setGameWinner(winner.winner)
            highLightWinningSequence(state, winner.winningLine)
        }
    }
    const highLightWinningSequence = (state, array) => {
        array.forEach(el => {
            // state[el] = `<bold>${state[el]}</bold>`
            state[el] = `(${state[el]})`
        });
        setBoardState(state)
    }
    const MakeBoard = (index) => {
        return (
            <ComponentSquare value={boardState[index]} onClick={() => setUsersMove(index)} />
        )
    }
    const resetBoard = () => {
        setBoardState(initialBoardState)
        setGameOver(false)
        setGameWinner(null)
        setPersonX(true)
        setGameOn(false)
        setIsNextMachine(false)
    }
    const getTitle = () => {
        if (isGameOver) return (
            "Game Over!"
        )
        if (gameWinner) return (
            `Game winner is : ${gameWinner}`
        )
        return `Best move for ${isPersonX ? "X" : "O"}`
    }

    return (
        <div>
            <div>
                <label htmlFor="select_symbol">Choose your symbol : </label>
                <select disabled={isGameOn} value={isPersonX ? "X" : "O"} id="select_symbol" onChange={(e) => { setPersonX(e.target.value === "X") }}>
                    <option>X</option>
                    <option>O</option>
                </select>
            </div>
            <div className="game_title">{getTitle()}</div>
            <div>{MakeBoard(0)}{MakeBoard(1)}{MakeBoard(2)}</div>
            <div>{MakeBoard(3)}{MakeBoard(4)}{MakeBoard(5)}</div>
            <div>{MakeBoard(6)}{MakeBoard(7)}{MakeBoard(8)}</div>
            <div><button onClick={() => resetBoard()}>Reset</button></div>
        </div>
    )
}

export default ComponentBoard
