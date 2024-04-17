"use strict";

//  ---　基本データ　---

// 地理のクイズデータ
const data = [
    {
        question: "岩手で一番高い山は?",
        answers: ["富士山", "岩手山", "姫神山", "早池峰山"],
        correct: "岩手山"
    },
    {
        question: "一番頭が悪いのは?",
        answers: ["かじ", "あきら", "なゆた", "けいご"],
        correct: "かじ"
    },
    {
        question: "日本で一番人口が多い県は？",
        answers: ["東京都", "北海道", "岩手県", "知りません"],
        correct: "知りません"
    },
];

// 出題する問題数
const QUESTION_LENGTH = 2;

//解答する時間(ms)
const ANSWER_TIME_MS = 10000;

// インターバル時間(ms)
const INTERVAL_TIME_MS = 10;

// 出題する問題データ
// let questions = data.slice(0, QUESTION_LENGTH);       //sliceメソッド:配列の中から指定した番号の要素を取得する
let questions = getRandomQuestions();

// 出題する問題のインデックス
let questionIndex = 0;

// 正解数
let correctCount = 0;

// 解答の開始時間
let startTime = null;

// インターバルID
let intervalId = null;

// 解答中の経過時間
let elapsedTime = 0;

//  ---　要素一覧　---
const startPage = document.getElementById("startPage");
const questionPage = document.getElementById("questionPage");
const resultPage = document.getElementById("resultPage");

const startBUtton = document.getElementById("startButton");

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionButtons = document.querySelectorAll("#questionPage button");
const questionProgress = document.getElementById("questionProgress");

const resultMassage = document.getElementById("resultMessage");

const dialog = document.getElementById("dialog");
const questionResult = document.getElementById("questionResult");
const nextButton = document.getElementById("nextButton");

const backButton = document.getElementById("backButton");




//  ---　処理　--


// ボタンをクリックしたときの動作追加
startBUtton.addEventListener("click", clickStartButton);

// ボタンが押されるたびに何回も実行したいからループ
optionButtons.forEach((button) => {
    // 選択肢ボタンが押されたときのイベント追加
    button.addEventListener("click", clickOptionButton);
});

// #nextButtonが押された時の処理
nextButton.addEventListener("click", clickNextButton);

backButton.addEventListener("click", clickBackButton);


// --- 関数一覧 ---

function questionTimeOver() {

    questionResult.innerText = "✕";

    if(isQuestionEnd()) {
        nextButton.innerText = "結果を見る";
    } else {
        nextButton.innerText = "次の問題へ";
    }

    // ダイアログの表示
    dialog.showModal();
}

// プログレスバーの再スタート
function startProgress() {

    // 開始時間(タイムスタンプ)を取得する
    startTime = Date.now();

    // インターバルの開始
    intervalId = setInterval(() => {

        // 現在の時刻(タイムスタンプ)を取得する
        const currentTime = Date.now();

        // 経過時間の計算
        const progress = ((currentTime - startTime) / ANSWER_TIME_MS) * 100;

        // プログレスバーに経過時間を反映させる
        questionProgress.value = progress;

        // 経過時間が解答時間を超えた場合、インターバルを停止する + 不正解のダイアログの表示
        if (startTime + ANSWER_TIME_MS <= currentTime) {
            stopProgress();
            questionTimeOver();
            return;
        }

    }, INTERVAL_TIME_MS);

    // // インターバルの開始
    // intervalId = setInterval(() => {

    //     // 経過時間の計算
    //     const progress = (elapsedTime / ANSWER_TIME_MS) * 100;

    //     // プログレスバーに経過時間を反映させる
    //     questionProgress.value = progress;

    //     // 経過時間が解答時間を超えた場合、インターバルを停止する + 不正解のダイアログの表示
    //     if (ANSWER_TIME_MS <= elapsedTime) {
    //         stopProgress();
    //         questionTimeOver();
    //         return;
    //     }

    //     // 経過時間を更新(加算)する
    //     elapsedTime += INTERVAL_TIME_MS;

    // }, INTERVAL_TIME_MS);
}

// プログレスバーの停止
function stopProgress() {

    // インターバルを停止する
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

// 変数のリセットのための関数
function reset() {

    // 出題する問題の取得(ランダム)
    questions = getRandomQuestions();

    // 出題する問題のインデックス初期化
    questionIndex = 0;

    // 正解数初期化
    correctCount = 0;

    // インターバルIDの初期化
    intervalId = null;

    // 解答中の経過時間の初期化
    elapsedTime = 0;

    // 開始時間の初期化
    startTime = null;

    // ボタンの有効化   ※disabledをremove
    for (let i = 0; i < optionButtons.length; i++) {
        optionButtons[i].removeAttribute("disabled");
    }
}


//最終問題かどうかの判定
function isQuestionEnd() {

    return questionIndex + 1 === QUESTION_LENGTH;

}


// 問題セット
function setQuestion() {

    // 問題を取得する
    const question = questions[questionIndex];

    // 問題番号を表示する
    questionNumber.innerText = `第 ${questionIndex + 1} 問`;

    // 問題文を表示する
    questionText.innerText = question.question;

    // 選択肢を表示する
    for (let i = 0; i < optionButtons.length; i++) {
        optionButtons[i].innerText = question.answers[i];
    }

}


//正解率計算と表示のための処理
function setResult() {

    //正解率の計算
    const accuracy = Math.floor((correctCount / QUESTION_LENGTH) * 100);

    //正解率をinnerTextにセット
    resultMassage.innerText = `正解率: ${accuracy}%`;

}

function getRandomQuestions() {

    // 出題する問題のインデックスリスト
    const questionIndexList = [];
    while (questionIndexList.length !== QUESTION_LENGTH) {

        // 出題する問題のインデックスをランダムに生成する
        const index = Math.floor(Math.random() * data.length);  //生成される乱数の範囲をdata.lengthに制限

        // インデックスリストに含まれていない場合、インデックスリストに追加する
        if (!questionIndexList.includes(index)) {    //includes => 指定した要素が配列に含まれているかの判定
            questionIndexList.push(index);
        }
    }

    const questionList = questionIndexList.map((index) => data[index]);
    return questionList;

}


//  ---　イベント関連の関数　---


// 一回選択肢をクリックしたら二回目以降は押せない設定にするための関数
function clickOptionButton(event) {

    // 解答中の経過時間をストップ
    stopProgress();
    // すべての選択肢を無効化する
    optionButtons.forEach((button) => {
        button.disabled = true;
    });

    //選択した選択肢のテキストを取得する
    const optionText = event.target.innerText; //event.targetでイベントが発生したタグの情報を取得できる

    //正解のテキストを取得する
    const correctText = questions[questionIndex].correct;

    // 正解か不正解かの判定処理
    if (optionText === correctText) {
        correctCount++;
        questionResult.innerText = "◯";
        // alert("正解")
    } else {
        questionResult.innerText = "✕";
        // alert("不正解");
    }

    // 最終問題かどうかでボタンの中身を編集
    if (isQuestionEnd()) {
        nextButton.innerText = "結果を見る";
    } else {
        nextButton.innerText = "次の問題へ";
    }

    // ダイアログを表示
    dialog.showModal();     //shouModalメソッド：dialogの表示のためのメソッド
}


// スタートボタンを押した後の動作についての関数
function clickStartButton() {

    // 問題画面に問題を設定する
    setQuestion();

    // 解答時間の計測を開始する
    startProgress();

    // スタート画面を非表示にする
    startPage.classList.add("hidden");

    // 問題画面を表示する
    questionPage.classList.remove("hidden");

    // 結果画面を非表示にする
    resultPage.classList.add("hidden");

}

// 次の問題へボタンについて
function clickNextButton() {

    //最終問題かどうかかの分岐
    if (isQuestionEnd()) {

        //正解率を設定する
        setResult();

        //ダイアログを閉じる
        dialog.close();

        // スタート画面を非表示にする
        startPage.classList.add("hidden");

        // 問題画面を非表示にする
        questionPage.classList.add("hidden");

        // 結果画面を表示する
        resultPage.classList.remove("hidden");

    } else {

        //elseならindexを増やして画面の再構築
        questionIndex++;

        // 問題画面に問題を設定する
        setQuestion();

        // インターバルIDの初期化
        intervalId = null;

        // 解答中の経過時間初期化
        elapsedTime = 0;

        // 開始時間の初期化
        // startTime = null;

        // すべての選択肢を有効にする
        for (let i = 0; i < optionButtons.length; i++) {

            optionButtons[i].removeAttribute("disabled");

        }

        //ダイアログを閉じる
        dialog.close();

        // 解答時間の計測開始
        startProgress();
    }
}

// 解答終了後の最初に戻るボタンについて
function clickBackButton() {

    // クイズのリセット
    reset();

    // スタート画面を表示する
    startPage.classList.remove("hidden");

    // 問題画面を非表示にする
    questionPage.classList.add("hidden");

    // 結果画面を非表示にする
    resultPage.classList.add("hidden");

}