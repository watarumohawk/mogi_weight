function getPath(){
    var path = window.location.href;
    if(path.match(/app\.psgi/)){
        path = path.replace(/(app\.psgi)(\/)(.*)/, "$1");
    }else if(path.match(/localhost/)){
        path = ".";
    }
    return path;
}