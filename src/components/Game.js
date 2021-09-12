import * as Chess from 'chess.js'; // NB 'import' idiom here..
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { auth } from '../firebase';
import { fromRef } from 'rxfire/firestore'; // should be fromDocRef???


let gameRef; // global for checking if local or online
let member;

const chess = new Chess();

// export const gameSubject = new BehaviorSubject();

export let gameSubject;

export async function initGame(gameRefFb){
    const { currentUser } = auth;
    if (gameRefFb){
        gameRef = gameRefFb;
        const initialGame = await gameRefFb.get().then(doc => doc.data());
        if (!initialGame) {
            console.log("gnf")
            return 'not found'
        }
        const creator = initialGame.members.find(m => m.creator === true);

        if (initialGame.status === 'waiting' && creator.uid !== currentUser.uid){
            const currUser = {
                uid: currentUser.uid,
                name: localStorage.getItem('userName'),
                piece: creator.piece === 'w' ? 'b' : 'w'
            }
            const updatedMembers = [...initialGame.members, currUser ] // THIS is 'cloning' the array
            await gameRefFb.update({members: updatedMembers, status: 'ready'});
        } else if (!initialGame.members.map(m => m.uid).includes(currentUser.uid)) {
            console.log("i")
            return 'intruder' 
        }
        chess.reset(); // wipe off any game cached

        gameSubject = fromRef(gameRefFb).pipe( // could use gameRef either // should be fromDocRef???
            map(gameDoc => {
                const game = gameDoc.data();
                const { pendingPromotion, gameData, ...restOfGame } = game;
                member = game.members.find(m => m.uid === currentUser.uid);
                const opponent = game.members.find(m => m.uid !== currentUser.uid);

                if (gameData) {
                    chess.load(gameData);
                }
                const isGameOver = chess.game_over();
                return {
                    board: chess.board(),
                    pendingPromotion,
                    isGameOver,
                    turn: member.piece,
                    member,
                    opponent,
                    result: isGameOver ? getGameResult() : null,
                    ...restOfGame
                }
            })
        ); 
    } else {
        gameRef = null;
        gameSubject = new BehaviorSubject();
        const savedGame = localStorage.getItem('savedGame');
        if (savedGame) {
            chess.load(savedGame);
        }
        updateGame();
    }
}

export async function resetGame(){
    if (gameRef) {
        await updateGame(null, true);
        chess.reset();
    } else {
        chess.reset();
        updateGame();
    }
}

export function handleMove(from, to){
    //const moves = chess.moves({verbose: true});
    //console.table(moves); // console.table... oooooooooh!
    const promotions = chess.moves({verbose: true}).filter(m => m.promotion);
    console.table(promotions);
    let pendingPromotion;
    if(promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)){
        // const 
        pendingPromotion = {from, to , color: promotions[0].color}
        updateGame(pendingPromotion);
    }
    // const {pendingPromotion} = gameSubject.getValue(); // issue here: 'not a valid method' on online/fb branch
    if(!pendingPromotion) {
        move(from, to);
    }
}

export function move(from, to, promotion) {
    let tempMove = { from, to };
    if (promotion) {
        tempMove.promotion = promotion;
    }
    if (gameRef) {
        if (member.piece === chess.turn()) {
            const legalMove = chess.move(tempMove);
            if (legalMove) {
                updateGame();
            }
        }
    } else {
        const legalMove = chess.move(tempMove);
        if (legalMove) {
            updateGame();
        }
    }
}
    //console.log(from, to);



async function updateGame(pendingPromotion, reset) {
    const isGameOver = chess.game_over();
    if (gameRef) {
        const updatedData = { gameData: chess.fen(), pendingPromotion: pendingPromotion || null }
        if (reset) {
            updatedData.status = 'over'
        }
        await gameRef.update(updatedData)
    } else {
        const newGame = {
            board: chess.board(),
            pendingPromotion,
            isGameOver,
            turn: chess.turn(),
            result: isGameOver ? getGameResult() : null
        }
        localStorage.setItem('savedGame', chess.fen())

        gameSubject.next(newGame);
    }
}

function getGameResult() {
    if (chess.in_checkmate()) {
        const winner = chess.turn() === 'w' ? 'BLACK' : 'WHITE'
        return `CHECKMATE - WINNER - ${winner}`
    } else if (chess.in_draw()) {
        let reason = 'DRAW - 50 MOVES RULE'
        if (chess.in_stalemate()) {
            reason = 'STALEMATE'
        } else if (chess.in_threefold_repetition()) {
            reason = 'DRAW BY REPETITION'
        } else if (chess.insufficient_material()) {
            reason = 'DRAW BY INSUFFICIENT MATERIAL'
        }
        return `DRAW - ${reason}`
    } else {
        return 'UNKNOWN REASON'
    }
}



export default gameSubject;
//export default move;