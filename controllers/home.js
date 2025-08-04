var app = {
    
    initialize: function() {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        } else {
            this.onDeviceReady();
        }
    },
    
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
    
    receivedEvent: function(id) {
        
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        
        /* Remove loading div. */
        document.getElementById("page-container").innerHTML = "";
        
        /* Load App */
        init_app();
    }
};

app.initialize();