function hod_kostkami(){
    let opt = {
        kostka2:['vykuř', 'olízni', 'kousni', 'vysaj', 'pohlaď', 'štípni'],
        kostka1:['rty', 'prdel', 'ucho', 'pupík', 'ceciky', 'stehno']
    }
    document.getElementById('kostka1').textContent = opt.kostka1[Math.floor(Math.random()*opt.kostka1.length)]
    document.getElementById('kostka2').textContent = opt.kostka2[Math.floor(Math.random()*opt.kostka2.length)]
}