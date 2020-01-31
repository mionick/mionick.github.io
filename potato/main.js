
let els = ["mouth", "eye1", "eye2", "eyebrow1", "eyebrow2", "lleg", "rleg", "thumbarm", "slaparm", "p1", "p2", "t1", "t2", "t3", "t4", "t5", "t6", "t7"];
let myPath;
let length;
for (let el of els) {
    myPath = document.getElementById(el);
    //console.log(myPath);
    length = myPath.getTotalLength();
    console.log(el + " : " + length);
}