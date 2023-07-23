function addControlToAlgorithmBar(type, name) {
    var element = document.createElement("input");
    element.setAttribute("type", type);
    element.setAttribute("value", name);
	
	var tableEntry = document.createElement("tr");
	tableEntry.appendChild(element);
    var controlBar = document.getElementById("Inputcontrol");
	
    controlBar.appendChild(tableEntry);
	return element;
}

function Algorithm(am){}

Algorithm.prototype.init = function(am, w, h){
	this.animationManager = am;
	am.addListener("AnimationStarted", this, this.disableUI);
	am.addListener("AnimationEnded", this, this.enableUI);
	am.addListener("AnimationUndo", this, this.undo);
	
	this.canvasWidth = w;
	this.canvasHeight = h;
	
	this.actionHistory = [];
	this.recordAnimation = true;
	this.commands = []
}
		
Algorithm.prototype.implementAction = function(funct, val){
	var nxt = [funct, val];			
	this.actionHistory.push(nxt);
	var retVal = funct(val);
	this.animationManager.StartNewAnimation(retVal);			
}
		
Algorithm.prototype.isAllDigits = function(str){
	for (var i = str.length - 1; i >= 0; i--){
		if (str.charAt(i) < "0" || str.charAt(i) > "9"){
			return false;
		}
	}
	return true;
}
		
Algorithm.prototype.normalizeNumber = function(input, maxLen){
	if (!this.isAllDigits(input) || input == ""){
		return input;
	}
	else{
		return ("OOO0000" +input).substr(-maxLen, maxLen);
	}
}
		
function controlKey(keyASCII){
	return keyASCII == 8 || keyASCII == 9 || keyASCII == 37 || keyASCII == 38 ||
	keyASCII == 39 || keyASCII == 40 || keyASCII == 46;
}

Algorithm.prototype.returnSubmit = function(field, funct, maxsize, intOnly){
	if (maxsize != undefined){
	    field.size = maxsize;
	}
	return function(event){
		var keyASCII = 0;
		if(window.event) {
			keyASCII = event.keyCode
		}
		else if (event.which) {
			keyASCII = event.which
		} 

		if (keyASCII == 13 && funct !== null){
			funct();
		}
        else if (keyASCII == 190 || keyASCII == 59 || keyASCII == 173 || keyASCII == 189){ 
			return false;	    
		}
		else if ((maxsize != undefined && field.value.length >= maxsize) ||
				 intOnly && (keyASCII < 48 || keyASCII > 57)){
			if (!controlKey(keyASCII))
				return false;
		}
	}
}

Algorithm.prototype.cmd = function(){
	if (this.recordAnimation){
		var command = arguments[0];
		for(i = 1; i < arguments.length; i++){
			command = command + "<;>" + String(arguments[i]);
		}
		this.commands.push(command);
	}
}
