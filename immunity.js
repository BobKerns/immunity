<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><head>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Herd Immunity Simulator</title>
<script type="text/javascript">

// Herd Immunity Simulator
// Written by Shane Killian
// Modified by Robert Webb
//
// License: Creative Commons-Attribution-ShareAlike
// See: http://creativecommons.org/licenses/by-sa/3.0/
// Please attribute Shane Killian as the original author in copies and
// derivative works, with a link to http://www.shanekillian.org/apps/herd.html

var xSize = 50;
var ySize = 16;


var totalVaccinated = 0;
var numInfected = 0;
var numVacInfected = 0;

function isVac(vacRate) {
	tmpRand = Math.random();
	if(tmpRand<(vacRate)) return true
		else return false;
}

function displayTable(populace) {
	totalVaccinated = 0;
	for(x=0;x<xSize;x++) {
		for(y=0;y<ySize;y++) {
			myCell = document.getElementById("cell"+y+"-"+x)
			if(populace[x][y]) {
				totalVaccinated++;
				myCell.style.color = "green";
			} else {
				myCell.style.color = "red";
			}
		}
	}
	var totalPop = xSize * ySize;
	var totalUnvaccinated = totalPop - totalVaccinated;
	document.getElementById('TotalPop').value = totalPop;
	document.getElementById('VacPop').value = totalVaccinated;
	document.getElementById('UnvacPop').value = totalUnvaccinated;
}

function populate() {
	var tmpRand,x,y;
	var vacRateLeft = document.getElementById('Left').value;
	var isSame = document.getElementById('RightSame').checked;
	if (isSame) {
		document.getElementById('Right').value = vacRateLeft;
	}
	var vacRateRight = document.getElementById('Right').value;
	var populace = new Array(xSize)
	for (i = 0; i < populace.length; ++ i)
		populace[i] = new Array(ySize);
	
	for(x=0;x<xSize/2;x++) {
		for(y=0;y<ySize;y++) {
				populace[x][y] = isVac(vacRateLeft);
		}
	}

	for(;x<xSize;x++) {
		for(y=0;y<ySize;y++) {
				populace[x][y] = isVac(vacRateRight);
		}
	}
	
	displayTable(populace);

	numInfected = 0;
	numVacInfected = 0;
	document.getElementById('NumInfected').value = "";
	document.getElementById('NumVacInfected').value = "";
	document.getElementById('NumUnvacInfected').value = "";
	document.getElementById('PercentInfected').value = "";
	document.getElementById('PercentVacPopInfected').value = "";
	document.getElementById('PercentUnvacPopInfected').value = "";
	document.getElementById('PercentInfectedVac').value = "";
}

function isVaccinated(x,y) {
	myCell = document.getElementById("cell"+y+"-"+x)
	if(myCell.style.color == "green") return true	// Since we're changing cell colors anyway, let's consider it storing the result
		else return false;
}

function isInfected(x,y) {
	myCell = document.getElementById("cell"+y+"-"+x)
	if(myCell.style.color == "black") return true
		else return false;
}

function infect(x,y) {
	if(isInfected(x,y)) return;

	var startX,startY,endX,endY,chance;
	var infectionRate = document.getElementById('InfectionRateNonVac').value;
	var vacInfectionRate = document.getElementById('InfectionRateVac').value;
	var infectionSpeed = document.getElementById('InfectionSpeed').value;

	myCell = document.getElementById("cell"+y+"-"+x)
	numInfected++;
	if(myCell.style.color == "green") {
		numVacInfected++;
	}

	var totalPop = xSize * ySize;
	var totalUnvaccinated = totalPop - totalVaccinated;
	var numUnvacInfected = numInfected - numVacInfected;
	var percentInfected = numInfected * 100 / totalPop;
	var percentVacPopInfected = numVacInfected * 100 / totalVaccinated;
	var percentUnvacPopInfected = numUnvacInfected * 100 / totalUnvaccinated;
	var percentInfectedVac = numVacInfected * 100 / numInfected;
	document.getElementById('NumInfected').value = numInfected;
	document.getElementById('NumVacInfected').value = numVacInfected;
	document.getElementById('NumUnvacInfected').value = numUnvacInfected;
	document.getElementById('PercentInfected').value = percentInfected;
	document.getElementById('PercentVacPopInfected').value = percentVacPopInfected;
	document.getElementById('PercentUnvacPopInfected').value = percentUnvacPopInfected;
	document.getElementById('PercentInfectedVac').value = percentInfectedVac;

	myCell = document.getElementById("cell"+y+"-"+x)
	myCell.style.color = "black";
	
	if(y <= 0) startY = 0
		else startY = parseInt(y) - 1;
	if(x <= 0) startX = 0
		else startX = parseInt(x) - 1;
	if(y >= ySize - 1) endY = ySize - 1
		else endY = parseInt(y) + 1;
	if(x >= xSize - 1) endX = xSize - 1
		else endX = parseInt(x) + 1;

	for(ix=startX;ix<=endX;ix++) {
		for(iy=startY;iy<=endY;iy++) {
			if(!isInfected(ix,iy)) {
				if(isVaccinated(ix,iy)) chance = vacInfectionRate
					else chance = infectionRate;
				if(chance>Math.random()) setTimeout('infect('+ix+','+iy+')',(500+(5000*Math.random())) / infectionSpeed); //The recursive bit
				
			}
		}
	}

}

function infectThis(cellObj) {
	var cellId = String(cellObj.id),x,y;
	y = cellId.substring(4,cellId.indexOf('-'));
	x = cellId.substring(cellId.indexOf('-')+1);
	
	infect(x,y); // Start the recursion
}

function rightSame() {
	var isSame = document.getElementById('RightSame').checked;
	document.getElementById('Right').disabled = isSame;
	if (isSame) {
		populate();
	}
}
</script>
<style type="text/css">
<!--
a {
	cursor: crosshair;
}
-->
</style>
</head>
<body onload="populate();" style="margin-top: 50px; background-color: rgb(50, 50, 75); color: rgb(204, 204, 204);">

<center>
<h2>Herd Immunity Simulator</h2>
<font size=-1>
written by
<a href="http://www.shanekillian.org/apps/herd.html"><font color=#00d000>Shane Killian</font>
</a><br>
modified by
<a href="http://www.software3d.com/"><font color=#00d000>Robert Webb</font></a>
</font>
</center>

<table align="center" border="0"><tr><td>
<font color=green>*</font> - Vaccinated cell<br>
<font color=red>*</font> - Unvaccinated cell<br>
<font color=black>*</font> - Infected cell<br>
<p>
Click on a cell below to infect it and watch how it spreads.
</td></tr></table>
<table id="Population" align="center" border="0">
  <tbody>
<script type="text/javascript">
  for(y=0;y<ySize;y++) {
    document.write('<tr>\n');
    for(x=0;x<xSize;x++) {
      document.write('<td><a onclick=\"infectThis(this);\" ');
      document.write('id=\"cell' + y + '-' + x + '\">*</a></td>\n');
    }
    document.write('</tr>\n');
  }
</script>
</tbody></table>

<table id="Population" align="center" border="0">
  <tbody>
  <tr>
  	<td style="text-align: right;">Immunization rate on left: <input id="Left" value=".9" onchange="populate();" type="text" size="5"></td>
	<td style="text-align: right;">Immunization rate on right: <input id="Right" value=".9" onchange="populate()" type="text" size="5" disabled="true"></td>
	<td style="text-align: left;"><input id="RightSame" type="checkbox" onclick="rightSame()" checked="true">Same as left</td>
  </tr>
  <tr>
  	<td style="text-align: right;">Infection rate if not vaccinated: <input id="InfectionRateNonVac" value=".9" type="text" size="5"></td>
	<td style="text-align: right;">Infection rate if vaccinated: <input id="InfectionRateVac" value=".1" type="text" size="5"></td>
	<td style="text-align: right;"><input value="Repopulate" onclick="populate()" type="submit"></td>
  </tr>
  <tr>
  	<td style="text-align: right;">Infection speed: <input id="InfectionSpeed" value="10" type="text" size="5"></td>
  </tr>
  <tr>
    <td colspan="3">&nbsp;</td>
  </tr>
  <tr>
    <td colspan="3"><font size=+2><b>Results:</b></font></td>
  </tr>
  <tr>
    <td colspan="3">
	Total population:
	<input id="TotalPop" value="" type="text" size="3" readonly>
	=
	<input id="VacPop" value="" type="text" size="3" readonly>
	vaccinated +
	<input id="UnvacPop" value="" type="text" size="3" readonly>
	unvaccinated.<br>
	Number infected:
	<input id="NumInfected" value="" type="text" size="3" readonly>
	=
	<input id="NumVacInfected" value="" type="text" size="3" readonly>
	vaccinated +
	<input id="NumUnvacInfected" value="" type="text" size="3" readonly>
	unvaccinated.<br>
	<font size=+2><b>
	<input id="PercentInfected" value="" type="text" size="3" readonly>
	% of population infected.</b></font><br>
	<input id="PercentVacPopInfected" value="" type="text" size="3" readonly>
	% of vaccinated population infected.<br>
	<input id="PercentUnvacPopInfected" value="" type="text" size="3" readonly>
	% of unvaccinated population infected.<br>
	<font size=+2><b>
	<input id="PercentInfectedVac" value="" type="text" size="3" readonly>
	% of infected that had been vaccinated.</b></font><br>
    </td>
  <tr>
</tbody></table>

<p>Anti-vaccinationists point to examples of real outbreaks where more than
half of those infected had been vaccinated.  Surely if most of those infected
had been vaccinated then the vaccine isn't much good, right?  Wrong.  The
simulator above shows that this is exactly what we expect to find.  This is
because most of the community is vaccinated, so even though a much lower
percentage of those vaccinated become infected, the total number may still be
greater.  It's a bit of statistical trickery on the anti-vaxxer's part.

<p>See also <a href="Graphs.php">
<font color=#ff8080>my article</font></a> about an anti-vax graph which made
use of some other statistical trickery.

<p><center>
<script language="Javascript"
src="../../Counter/count.php?page=sw3d:/Home/Vax/Immunity.php&since=3rd July 2018"></script>
</center></p>
</body></html>
