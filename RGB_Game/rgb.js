var squares = document.querySelectorAll('.square');
var colourDisplay = document.querySelector('#colourDisplay');
var messageDisplay = document.querySelector('#message');
var resetButton = document.querySelector('#reset');
var h1 = document.querySelector('h1');
var easyBtn = document.querySelector('#easyBtn');
var hardBtn = document.querySelector('#hardBtn');

var num_colours = 6
var colours = [];
var pickedColour;

init();

function init(){
    resetButton.addEventListener('click', reset)

    easyBtn.addEventListener('click', function(){
        easyBtn.classList.add('selected');
        hardBtn.classList.remove('selected')
        num_colours = 3;
        reset();
        for (var i=3; i<squares.length; i++){
            squares[i].style.display = 'none'
        }
    })
    
    hardBtn.addEventListener('click', function(){
        hardBtn.classList.add('selected');
        easyBtn.classList.remove('selected')
        num_colours = 6;
        reset();
        for (var i=3; i<squares.length; i++){
            squares[i].style.display = 'block'
        }
    })
    
    for(var i = 0; i < squares.length ; i++){
        squares[i].style.backgroundColor = colours[i];
    
        squares[i].addEventListener('click', function(){
            let clickedColour = this.style.backgroundColor;
            if (clickedColour === pickedColour){
                messageDisplay.textContent = 'Correct!';
                changeColours(clickedColour);
                h1.style.backgroundColor = clickedColour;
                resetButton.textContent = 'Play Again?';
            }
            else {
                this.style.backgroundColor = '#232323';
                messageDisplay.textContent = 'Try Again';
            }
        })
    }

    reset()
}





function changeColours(colour){
    for(var i = 0; i < squares.length; i++){
        squares[i].style.backgroundColor = colour;
    }
}

function pickColour(){
    let random = Math.floor(Math.random() * colours.length);
    return colours[random];
}

function generateRandomColours(num){
    let arr = [];
    for(var i=0; i<num; i++){
        arr.push(randomColour())
    }
    return arr;
}

function randomColour(){
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`

}

function reset(){
    colours = generateRandomColours(num_colours);
    pickedColour = pickColour();
    colourDisplay.textContent = pickedColour;
    h1.style.backgroundColor = 'steelblue';
    resetButton.textContent = 'New Colours';
    messageDisplay.textContent = '';
    for(var i = 0; i < squares.length ; i++){
        squares[i].style.backgroundColor = colours[i];
    }
}