const Input = (function () {
    var constructeur = function () {
        this.keyUpHandler = function (event) {
            if (!Input.getInstance().lock) {
                delete Input.getInstance().inputActive[event.code];
            }
        }
        this.keyDownHandler = function (event) {
            if (!Input.getInstance().lock){
                Input.getInstance().inputActive[event.code] = true;
                Input.getInstance().lastInput = event.code;
                console.log(Input.getInstance().inputActive);
            }
        }
        this.out = function (e) {
            e = e ? e : window.event;
            var from = e.relatedTarget || e.toElement;
            if (!from || from.nodeName == "HTML") {
                Input.getInstance().inputActive = {};
                Input.getInstance().lock = true;
            }
        }
        this.in = function (e) {
            if (Input.getInstance().lock) {
                Input.getInstance().lock = false;
            }
        }
        this.inputActive = {};
        this.lastInput = null;
        this.lock = false;
    }
    let saveInstance = null;
    return new function () {
        this.getInstance = function () {
            if (saveInstance == null) {
                saveInstance = new constructeur();
                saveInstance.constructeur = null;
            }
            return saveInstance;
        }
    }
})();