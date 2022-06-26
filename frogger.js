document.addEventListener("DOMContentLoaded",()=>{
    
    //Constants
    const container=document.querySelector(".container");
    const width=15;
    const finalImage=document.querySelector(".representation");


    //Variables
    let frogPos=215;
    let direction=1;
    let flag=false;
    let i;  
    let gameEnded=false;
    

    //Div creation
    for(i=0;i<225;i++){
        const div=document.createElement("div");
        container.appendChild(div);
    }


    //Grid fetching
    const grids=document.querySelectorAll(".container div");


    //Universal class removal,adder and checker
    const addClass=(element,cls)=>{
        element.classList.add(cls);
    }
    const removeClass=(element,cls)=>{
        element.classList.remove(cls);
    }
    const containsClass=(element,cls)=>{
        if(element.classList.contains(cls)){
            return true;
        }
        else{
            return false;
        }
    }


    //Frog class assignment and removal
    const assignFrogClass=()=>{
        if(!((frogPos+width>=width*width && direction===width)||(frogPos-width<0 && direction===-width)||(frogPos%width===0 && direction===-1)||(frogPos%width===width-1 && direction===1))){
            removeClass(grids[frogPos],"frog");
            frogPos+=direction;
            addClass(grids[frogPos],"frog");
            (containsClass(grids[frogPos],"log")) && removeClass(grids[frogPos],"log");
            (containsClass(grids[frogPos],"river")) && removeClass(grids[frogPos],"river");
            (containsClass(grids[frogPos],"road")) && removeClass(grids[frogPos],"road");
            flag=true;
        }
    }
    assignFrogClass();


    //Destination assignment
    addClass(grids[7],"destination");


    //Road assignment
    const assignRoad=()=>{
        for(i=165;i<=194;i++){
            (!containsClass(grids[i],"frog")) && addClass(grids[i],"road");
        }
        for(i=30;i<=59;i++){
            (!containsClass(grids[i],"frog")) && addClass(grids[i],"road");
        }
    }
    assignRoad();


    //River assignment
    const assignRiver=()=>{
        for(i=90;i<=134;i++){
            (!containsClass(grids[i],"frog")) && addClass(grids[i],"river");
        }
    }
    assignRiver();


    //Fallable Assignment
    const assignFallable=()=>{
        for(i=90;i<=134;i++){
            (containsClass(grids[i],"log"))?removeClass(grids[i],"fallable"):addClass(grids[i],"fallable");
        }
    }


    //Listening to keyboard entries
    const mover=(e)=>{ 
        if(!gameEnded){
            if(e.keyCode===37) direction=-1;
            else if(e.keyCode===38) direction=-width;
            else if(e.keyCode===39) direction=1;
            else if(e.keyCode===40) direction=width;
            assignFrogClass();
            if(flag===true){
                assignRoad(); 
                assignRiver();
            }  
            (containsClass(grids[frogPos],"fallable")) && gameOver(false);
            (containsClass(grids[7],"frog")) && gameOver(true);
        }
    }


    //Moving cars rightwards 
    const moveCarRight=(starting,ending)=>{
        if(!gameEnded){
            if(starting===ending+1){
                removeClass(grids[ending],"car");
                return;
            }
            if(grids[starting].classList.contains("frog")) {
                gameOver(false);
                return;
            }
            addClass(grids[starting],"car");
            removeClass(grids[starting-1],"car");
            setTimeout(()=>moveCarRight(starting+1,ending),500);
        }
    }


    //Moving cars leftwards
    const moveCarLeft=(starting,ending)=>{
        if(!gameEnded){
            if(starting===ending-1){
                removeClass(grids[ending],"car")
                return;
            }
            if(grids[starting].classList.contains("frog")) {
                gameOver(false);
                return;
            }
            addClass(grids[starting],"car");
            removeClass(grids[starting+1],"car");
            setTimeout(()=>moveCarLeft(starting-1,ending),500);
        }
    }


    //Moving logs rightwards
    const moveLogsRight=(starting,ending)=>{
        if(!gameEnded){
            if(starting===ending){
                removeClass(grids[ending],"log");
                removeClass(grids[ending-1],"log");
                return;
            }
            if(containsClass(grids[starting],"frog"))  moveFrogWithLog(1) 
            else {
                addClass(grids[starting],"log");
            }
            if(!containsClass(grids[starting+1],"frog"))  {
                addClass(grids[starting+1],"log");
            }
            (containsClass(grids[starting-1],"frog")) && moveFrogWithLog(1);
            removeClass(grids[starting-1],"log");
            removeClass(grids[starting-2],"log");
            assignFallable();
            setTimeout(()=>moveLogsRight(starting+1,ending),500);    
        }
    }


    //Moving logs leftwards
    const moveLogsLeft=(starting,ending)=>{
        if(!gameEnded){
            if(starting===ending){
                removeClass(grids[ending],"log");
                removeClass(grids[ending+1],"log");
                return;
            }
    
            if(containsClass(grids[starting],"frog")) moveFrogWithLog(-1);
            else addClass(grids[starting],"log");
            if(!containsClass(grids[starting-1],"frog")) addClass(grids[starting-1],"log");
                
            (containsClass(grids[starting+1],"frog")) && moveFrogWithLog(-1);
            removeClass(grids[starting+1],"log");
            removeClass(grids[starting+2],"log");
            assignFallable();
            setTimeout(()=>moveLogsLeft(starting-1,ending),500);    
        }
    }


    //Move the frog along the log when it stands over it 
    const moveFrogWithLog=(value)=>{
        direction=value;
        addClass(grids[frogPos],"log");
        assignFrogClass();
        assignRiver();
    }
    
    //Event triggered on keyboard button up
    document.addEventListener("keyup",mover);


    //Movement
    const triggerMovement=()=>{
        moveCarRight(165,179);
        moveCarRight(30,44)
        moveCarLeft(194,180);
        moveCarLeft(59,45)
        moveLogsRight(90,104);
        moveLogsRight(120,134);
        moveLogsLeft(119,105);
    }
    triggerMovement();
    const movementInterval=setInterval(triggerMovement,2000);


    //Game over logics
    /*Give a parameter to the gameOver method hasWon. If hasWon then the hasOne will be displayed
    on the end dialog else lost will be displayed*/


    const gameOver=(hasWon)=>{
        clearInterval(movementInterval);
        const msgBox=document.querySelector(".message");
        if(hasWon){
            msgBox.textContent="You won the game !!";
            finalImage.setAttribute('src','./textures/crown.png');
        }
        else{
            removeClass(grids[frogPos],"frog");
            addClass(grids[frogPos],"deadFrog");
            finalImage.setAttribute('src','./textures/deadFrog.svg');
            msgBox.textContent="You lost";
        }
        gameEnded=true;    
        document.querySelector(".endDialog").classList.add("getDown");
    }


    document.querySelector(".btn-primary").addEventListener("click",()=>window.location.reload());

})