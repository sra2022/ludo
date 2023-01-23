//first function
window.onload=()=> {
	if(window.innerWidth<window.innerHeight) {
		displayHome();
	}
	else displaySizeMessage();
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
					case 1: winBox.id="winBox1";
						winBox.setAttribute("class","winBoxH");
						break;
					case 2: winBox.id="winBox2";
						winBox.setAttribute("class","winBoxV");
						break;
					case 3: winBox.id="pointer";
						break;
					case 4: winBox.id="winBox3";
						winBox.setAttribute("class","winBoxV");
						break;
					case 5: winBox.id="winBox4";
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

//display mesaage about screen orientation
function displaySizeMessage() {
	document.getElementById("app").innerHTML="Set orientation to portrait and REFRESH";
}

//set 4 different colors
function setColors() {
	const colors=["#ee2029","#3df43f","#3144d4","#f9db17"];
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
	for(let j=1;j<=4;j++) document.getElementById("winBox"+j).style.backgroundColor=colors2[j-1];
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
				home.appendChild(piece);
			}
		}
	}
}
