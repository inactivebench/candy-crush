document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".candy-grid");
  const scoreDisplay = document.getElementById("score");
  const movesDisplay = document.getElementById("moves");
  const width = 8;
  const squares = [];
  let score = 0;
  let moves = 100;
  movesDisplay.innerHTML = moves;

  const candyColors = [
    "url(images/Red.png)",
    "url(images/Green.png)",
    "url(images/Orange.png)",
    "url(images/Yellow.png)",
    "url(images/Blue.png)",
    "url(images/Purple.png)",
  ];
  //create Board
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("draggable", true);
      square.setAttribute("id", i);
      let randomColor = Math.floor(Math.random() * candyColors.length);
      square.style.backgroundImage = candyColors[randomColor];
      grid.appendChild(square);
      squares.push(square);
    }
  }
  createBoard();

  // Drag the candies
  let colorBeingDragged;
  let colorBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;

  squares.forEach((square) => square.addEventListener("dragstart", dragStart));
  squares.forEach((square) => square.addEventListener("dragend", dragEnd));
  squares.forEach((square) => square.addEventListener("dragover", dragOver));
  squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
  squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
  squares.forEach((square) => square.addEventListener("drop", dragDrop));

  function dragStart() {
    colorBeingDragged = this.style.backgroundImage;
    squareIdBeingDragged = parseInt(this.id);
    console.log(colorBeingDragged, squareIdBeingDragged);
    console.log(this.id, "dragstart");
  }
  function dragOver(e) {
    e.preventDefault();
    console.log(this.id, "dragover");
  }
  function dragEnter(e) {
    e.preventDefault();
    console.log(this.id, "dragenter");
  }
  function dragLeave() {
    console.log(this.id, "dragleave");
  }
  function dragDrop() {
    console.log(this.id, "dragdrop");
    colorBeingReplaced = this.style.backgroundImage;
    squareIdBeingReplaced = parseInt(this.id);
    this.style.backgroundImage = colorBeingDragged;
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    moves--;
    movesDisplay.innerHTML = moves;
  }

  function dragEnd() {
    console.log(this.id, "dragend");
    //what is a valid move?
    let validMoves = [
      squareIdBeingDragged - 1,
      squareIdBeingDragged - width,
      squareIdBeingDragged + 1,
      squareIdBeingDragged + width,
    ];
    let validMove = validMoves.includes(squareIdBeingReplaced);

    if (squareIdBeingReplaced && validMove) {
      squareIdBeingReplaced = null;
    } else if (squareIdBeingReplaced && !validMove) {
      // if dragged square is out of bounds, no change happens
      squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    } else {
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    }
  }

  //------------drop and generate candies------------
  // drop candies once some have been cleared
  function moveCandiesDown() {
    for (i = 0; i <= 55; i++) {
      //check if square below is empty
      if (squares[i + width].style.backgroundImage === "") {
        squares[i + width].style.backgroundImage =
          squares[i].style.backgroundImage;
        squares[i].style.backgroundImage = "";
      }
    }
  }
  // generate candies from the first row
  function generateCandies() {
    const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
    for (i = 0; i < firstRow.length; i++) {
      const isFirstRow = firstRow.includes(i);
      if (isFirstRow && squares[i].style.backgroundImage === "") {
        let randomColor = Math.floor(Math.random() * candyColors.length);
        squares[i].style.backgroundImage = candyColors[randomColor];
      }
    }
  }

  //------------ checking for matches-------------
  // check for row of five
  function checkRowForFive() {
    for (i = 0; i <= 59; i++) {
      let rowOfFive = [i, i + 1, i + 2, i + 3, i + 4];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      const notValid = [
        4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 36, 37, 38,
        39, 44, 45, 46, 47, 52, 53, 54, 55,
      ];

      if (notValid.includes(i)) continue;
      if (
        rowOfFive.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        rowOfFive.forEach((index) => {
          score += 5;
          scoreDisplay.innerHTML = score;
          squares[index].style.backgroundImage = "";
          squares[i].style.backgroundImage = "url(images/Choco.png)";
        });
      }
    }
  }
  //check for column of Five
  function checkColumnForFive() {
    for (i = 0; i <= 31; i++) {
      let columnOfFive = [
        i,
        i + width,
        i + width * 2,
        i + width * 3,
        i + width * 4,
      ];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      if (
        columnOfFive.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        columnOfFive.forEach((index) => {
          score += 5;
          scoreDisplay.innerHTML = score;
          squares[index].style.backgroundImage = "";
          squares[i].style.backgroundImage = "url(images/Choco.png)";
        });
      }
    }
  }

  // check for row of Four
  function checkRowForFour() {
    for (i = 0; i <= 60; i++) {
      let rowOfFour = [i, i + 1, i + 2, i + 3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55,
      ];

      if (notValid.includes(i)) continue;
      if (
        rowOfFour.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        rowOfFour.forEach((index) => {
          score += 4;
          scoreDisplay.innerHTML = score;
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  //check for column of four
  function checkColumnForFour() {
    for (i = 0; i <= 39; i++) {
      let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      if (
        columnOfFour.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        columnOfFour.forEach((index) => {
          score += 4;
          scoreDisplay.innerHTML = score;
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }

  // check for row of three
  function checkRowForThree() {
    for (i = 0; i <= 61; i++) {
      let rowOfThree = [i, i + 1, i + 2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];

      if (notValid.includes(i)) continue;
      if (
        rowOfThree.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        rowOfThree.forEach((index) => {
          score += 3;
          scoreDisplay.innerHTML = score;
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }

  //check for column of three
  function checkColumnForThree() {
    for (i = 0; i <= 47; i++) {
      let columnOfThree = [i, i + width, i + width * 2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      if (
        columnOfThree.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        columnOfThree.forEach((index) => {
          score += 3;
          scoreDisplay.innerHTML = score;
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }

  //functions run every 1/10 of a second
  window.setInterval(function () {
    generateCandies();
    moveCandiesDown();
    checkRowForFive();
    checkColumnForFive();
    checkRowForFour();
    checkColumnForFour();
    checkRowForThree();
    checkColumnForThree();
  }, 100);
});
