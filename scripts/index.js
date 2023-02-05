const colors=["#ee2029","#3df43f","#3144d4","#f9db17"];
let gamePath=[];
let lockedPiece=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let playerId=Math.floor(Math.random()*4)+1;
let won=[0,0,0,0];
let ranked=[false,false,false,false];
let ranks=[0,0,0,0];
let rank=[1];
const moveSound=new Audio("assets/move.mp3");
const diceSound=new Audio("assets/dice.mp3");
const winSound=new Audio("assets/win.mp3");
const hitSound=new Audio("assets/hit.mp3");
let diceValue;
let lockDice=false;

//first function
window.onload=()=> {
	displayHome();
}

//home screen
function displayHome() {
	const app=document.getElementById("app");
	const logo=new Image();
	logo.src="assets/favicon.svg";
	logo.id="favicon";
	app.appendChild(logo);
	const heading=document.createElement("div");
	heading.id="heading";
	heading.innerHTML="Ludo 4 player Game";
	app.appendChild(heading);
	const playButton=document.createElement("button");
	playButton.id="playButton";
	playButton.innerHTML="Play";
	playButton.addEventListener("click",()=> {
		while(app.hasChildNodes()) app.removeChild(app.firstChild);
		createBoard();
		createPath();
		startGame();
	});
	app.appendChild(playButton);
	const credits=document.createElement("a");
	credits.setAttribute("href","https://github.com/sra2022");
	credits.innerHTML="SRA2022";
	credits.setAttribute("target","_blank");
	app.appendChild(credits);
}	

//create center board
function createBoard() {
	const app=document.getElementById("app");
	const centerDiv=document.createElement("div");
	centerDiv.id="center";
	app.appendChild(centerDiv);

	//create boxes inside centreDiv
	for(let i=1;i<=9;i++) {
		const box=document.createElement("div");
		box.id="box"+i;
		if(i==2 || i==8) box.setAttribute("class","evenBoxV");
		else if(i==4 || i==6) box.setAttribute("class","evenBoxH");
		else if(i==5) {
			box.setAttribute("class","centerBox");
			for(let j=1;j<=5;j++) {
				const winBox=document.createElement("div");
				switch(j) {
					case 1: winBox.id="winBox3";
						winBox.setAttribute("class","winBoxH");
						break;
					case 2: winBox.id="winBox1";
						winBox.setAttribute("class","winBoxV");
						break;
					case 3: winBox.id="pointer";
						winBox.innerHTML="SRA";
						break;
					case 4: winBox.id="winBox9";
						winBox.setAttribute("class","winBoxV");
						break;
					case 5: winBox.id="winBox7";
						winBox.setAttribute("class","winBoxH");
				}
				box.appendChild(winBox);
			}
		}
		else box.setAttribute("class","oddBox");
		centerDiv.appendChild(box);
	}

	//create steps
	for(let i=2;i<=8;i+=2) {
		const evenBox=document.getElementById("box"+i);
		for(let j=1;j<=18;j++) {
			const step=document.createElement("div");
			step.id="step"+i+"-"+j;
			if(i==2 || i==8) step.setAttribute("class","stepH");
			else step.setAttribute("class","stepV");
			evenBox.appendChild(step);
		}
	}		

	//create controls
	for(let i=1;i<=2;i++) {
		const controlBar=document.createElement("div");
		controlBar.setAttribute("class","controlBar");
		for(let j=1;j<=2;j++) {
			const diceHolder=document.createElement("div");
			diceHolder.setAttribute("class","diceHolder");
			if(i==1) diceHolder.id="diceHolder"+j;
			else diceHolder.id="diceHolder"+(j+2);
			controlBar.appendChild(diceHolder);
		}
		if(i==1) app.insertBefore(controlBar,app.children[0]);
		else app.appendChild(controlBar);

	}
	createPieces();
	setColors();
}

//set 4 different colors
function setColors() {
	let i=0;
	for(let j=1;j<=9;j+=2) {
		if(j!=5) {
			document.getElementById("box"+j).style.backgroundColor=colors[i];
			for(let k=1;k<=4;k++) document.getElementById("box"+j+"-"+k).style.backgroundColor=colors[i];
			i++;
		}
	}
	//color the winBox
	const colors2=["#3df43f","#ee2029","#f9db17","#3144d4"];
	let colorIndex=0;
	for(let j=1;j<=9;j+=2) {
		if(j!=5) {
			document.getElementById("winBox"+j).style.backgroundColor=colors[colorIndex];
			colorIndex++;
		}
	}
	//color special steps
	for(let j=2,k=0;j<=8;j+=2,k++) {
		if(j==2 || j==4) for(let i=8;i<=12;i++) document.getElementById("step"+j+"-"+i).style.backgroundColor=colors2[k];
		else for(let i=7;i<=11;i++) document.getElementById("step"+j+"-"+i).style.backgroundColor=colors2[k];
	}
	document.getElementById("step2-14").style.backgroundColor=colors2[0];
	document.getElementById("step4-2").style.backgroundColor=colors2[1];
	document.getElementById("step6-17").style.backgroundColor=colors2[2];
	document.getElementById("step8-5").style.backgroundColor=colors2[3];

	//color diceHolder
	for(let i=1;i<=4;i++) document.getElementById("diceHolder"+i).style.borderColor=colors[i-1];
}

//create 16 pieces 
function createPieces() {
	for(let i=1;i<=9;i+=2) {
		if(i!=5) {
			const home=document.getElementById("box"+i);
			for(let j=1;j<=4;j++) {
				const piece=document.createElement("div");
				piece.setAttribute("class","piece");
				piece.id=home.id+"-"+j;
				piece.addEventListener("click",()=> {
					if(piece.parentElement.id.slice(0,3)=="box") enterStep(piece.id);
				});
				piece.addEventListener("click",()=> {
					if(piece.parentElement.getAttribute("class")!="oddBox") moveForward(piece.id);
				});
				home.appendChild(piece);
			}
		}
	}
}

//path for the game
function createPath() {
	let index=0;
	for(let i=6;i>0;i--) {
		gamePath[index]="step2-"+i;
		index++;
	}
	gamePath[index]="step2-7";
	index++;
	for(let i=13;i<=18;i++) {
		gamePath[index]="step2-"+i;
		index++;
	}
	for(let i=1;i<=6;i++) {
		gamePath[index]="step6-"+i;
		index++;
	}
	gamePath[index]="step6-12";
	index++;
	for(let i=18;i>12;i--) {
		gamePath[index]="step6-"+i;
		index++;
	}
	for(let i=13;i<=18;i++) {
		gamePath[index]="step8-"+i;
		index++;
	}
	gamePath[index]="step8-12";
	index++;
	for(let i=6;i>0;i--) {
		gamePath[index]="step8-"+i;
		index++;
	}
	for(let i=18;i>12;i--) {
		gamePath[index]="step4-"+i;
		index++;
	}
	gamePath[index]="step4-7";
	index++;
	for(let i=1;i<=6;i++) {
		gamePath[index]="step4-"+i;
		index++;
	}
	//coloured path
	//red
	for(let i=8;i<=12;i++) {
		gamePath[index]="step4-"+i;
		index++;
	}
	gamePath[index]="winBox1"; //index=57
	index++;
	//green
	for(let i=8;i<=12;i++) {
		gamePath[index]="step2-"+i;
		index++;
	}
	gamePath[index]="winBox3"; //index=63
	index++;
	//yellow
	for(let i=11;i>=7;i--) {
		gamePath[index]="step6-"+i;
		index++;
	}
	gamePath[index]="winBox9"; //index=69
	index++;
	//blue
	for(let i=11;i>=7;i--) {
		gamePath[index]="step8-"+i;
		index++;
	}
	gamePath[index]="winBox7"; //index=75
}
		
//start game
function startGame() {
	document.getElementById("pointer").style.backgroundColor=colors[playerId-1];
	document.getElementById("diceHolder"+playerId).style.outline="solid #fff 3px";
	for(let i=1;i<=4;i++) {
		const player=document.getElementById("diceHolder"+i);
		player.addEventListener("click",()=> {
			if(playerId==parseInt(player.id.slice(10)) && !lockDice) {
				lockDice=true;
				diceSound.play();
				player.style.animation="circle 1s linear 1 normal";
				for(let j=1;j<=4;j++) document.getElementById("diceHolder"+j).innerHTML="";
				diceValue=Math.floor(Math.random()*6)+1;
				setTimeout(()=> {
					player.innerHTML=diceValue;
					player.style.animation="none";
				},500);
				unlockPiece(i);
				let playerNo;
				switch(playerId) {
					case 1: playerNo=1;
						break;
					case 2: playerNo=3;
						break;
					case 3: playerNo=7;
						break;
					case 4: playerNo=9;
				}
				if((document.getElementById("box"+playerNo).childNodes.length)+(document.getElementById("winBox"+playerNo).childNodes.length)>3) nextPlayer();
			}
		});
	}
}

//move piece to path
function enterStep(pieceId) {
	if(diceValue!=6) return;
	let pieceIndex;
	if(parseInt(pieceId.slice(3,4))==1) pieceIndex=parseInt(pieceId.slice(5));
	else if(parseInt(pieceId.slice(3,4))==3) pieceIndex=4+parseInt(pieceId.slice(5));
	else if(parseInt(pieceId.slice(3,4))==7) pieceIndex=8+parseInt(pieceId.slice(5));
	else pieceIndex=12+parseInt(pieceId.slice(5));
	if(lockedPiece[pieceIndex]==1) {
		const piece=document.getElementById(pieceId);
		let containerId;
		switch(parseInt(pieceId.slice(3,4))) {
			case 1:	containerId="step4-2";
				break;
			case 3: containerId="step2-14";
				break;
			case 7: containerId="step8-5";
				break;
			case 9: containerId="step6-17";
		}
		const container=document.getElementById(containerId);
		container.appendChild(piece);
		moveSound.play();
		for(let i=0;i<lockedPiece.length;i++) lockedPiece[i]=0;
		lockDice=false;
	}
}

//make piece movable
function unlockPiece(player) {
	if(player==1) for(let i=1;i<=4;i++) lockedPiece[i]=1;
	else if(player==2) for(let i=5;i<=8;i++) lockedPiece[i]=1;
	else if(player==3) for(let i=9;i<=12;i++) lockedPiece[i]=1;
	else for(let i=13;i<=16;i++) lockedPiece[i]=1;
}

//move piece forward through steps
function moveForward(pieceId) {
	let piece=document.getElementById(pieceId);
	let pieceIndex;
	if(parseInt(pieceId.slice(3,4))==1) pieceIndex=parseInt(pieceId.slice(5));
	else if(parseInt(pieceId.slice(3,4))==3) pieceIndex=4+parseInt(pieceId.slice(5));
	else if(parseInt(pieceId.slice(3,4))==7) pieceIndex=8+parseInt(pieceId.slice(5));
	else pieceIndex=12+parseInt(pieceId.slice(5));
	let newStep;
	if(lockedPiece[pieceIndex]==1) {
		for(let j=0;j<diceValue;j++) {
			let currentStep=gamePath.indexOf(piece.parentElement.id);
			let newStepId;
			if(currentStep==57 || currentStep==63 || currentStep==69 || currentStep==75) newStepId=gamePath[currentStep];
			else if(pieceId.slice(3,4)==1 && currentStep==45) newStepId=gamePath[52];
			else if(pieceId.slice(3,4)==3 && currentStep==6) newStepId=gamePath[58];
			else if(pieceId.slice(3,4)==7 && currentStep==32) newStepId=gamePath[70];
			else if(pieceId.slice(3,4)==9 && currentStep==19) newStepId=gamePath[64];
			else if(currentStep==51) newStepId=gamePath[0];
			else newStepId=gamePath[currentStep+1];
			newStep=document.getElementById(newStepId);
			newStep.appendChild(piece);	
			moveSound.play();
			//update result
			switch(gamePath.indexOf(newStepId)) {
				case 63:won[1]=newStep.childNodes.length;
					if(!ranked[1] && newStep.childNodes.length==4) {
						ranks[1]=rank;
						ranked[1]=true;
						rank++;
						document.getElementById("box3").innerHTML=ranks[1];
						winSound.play();
						if(diceValue==6) nextPlayer();
					}
					break;
				case 69:won[3]=newStep.childNodes.length;
					if(!ranked[3] && newStep.childNodes.length==4) {
						ranks[3]=rank;
						ranked[3]=true;
						rank++;
						document.getElementById("box9").innerHTML=ranks[3];
						winSound.play();
						if(diceValue==6) nextPlayer();
					}
					break;
				case 75:won[2]=newStep.childNodes.length;
					if(!ranked[2] && newStep.childNodes.length==4) {
						ranks[2]=rank;
						ranked[2]=true;
						rank++;
						document.getElementById("box7").innerHTML=ranks[2];
						winSound.play();
						if(diceValue==6) nextPlayer();
					}
					break;
				case 57:won[0]=newStep.childNodes.length;
					if(!ranked[0] && newStep.childNodes.length==4) {
						ranks[0]=rank;
						ranked[0]=true;
						rank++;
						document.getElementById("box1").innerHTML=ranks[0];
						winSound.play();
						if(diceValue==6) nextPlayer();
					}
			}
		}
		for(let i=0;i<lockedPiece.length;i++) lockedPiece[i]=0;
		let hitChance=0;
		for(let i=0;i<newStep.childNodes.length;i++) {
			while(newStep.childNodes[i].id.slice(3,4)!=piece.id.slice(3,4)) {
				document.getElementById("box"+newStep.childNodes[i].id.slice(3,4)).appendChild(newStep.childNodes[i]);
				if(hitChance==0 && diceValue!=6) {
					switch (playerId) {
						case 1: playerId=3;
							break;
						case 3: playerId=4;
							break;
						case 4: playerId=2;
							break;
						case 2: playerId=1;
					}
				}
				moveSound.pause();
				hitSound.play();
				hitChance=1;
				document.getElementById("pointer").style.backgroundColor=colors[playerId-1];
			}
		}
		nextPlayer();
	}
}

//Update player
function nextPlayer() {
	document.getElementById("diceHolder"+playerId).style.outline="none";
	document.getElementById("diceHolder"+playerId).innerHTML="";;
	if(diceValue!=6) {
		switch(playerId) {
			case 1: playerId=2;
				break;
			case 2:playerId=4;
				break;
			case 4:playerId=3;
				break;
			case 3:playerId=1;
		}
	}
	for(let k=0;k<4;k++) {
		if(ranked[playerId-1]) {
			switch(playerId) {
				case 1:playerId=2;
					break;
				case 2:playerId=4;
					break;
				case 4:playerId=3;
					break;
				case 3:playerId=1
			}
		}
	}
	document.getElementById("pointer").style.backgroundColor=colors[playerId-1];
	document.getElementById("diceHolder"+playerId).style.outline="solid #fff 3px";
	document.getElementById("diceHolder"+playerId).innerHTML="";;
	lockDice=false;
}
