$("#own_address").val(address);
$("#own_alias").val(alias);
$('#summary').on('propertychange input', function(e) {
    var valueChanged = false;

    if (e.type == 'propertychange') {
        valueChanged = e.originalEvent.propertyName == 'value';
    } else {
        valueChanged = true;
    }
    if (valueChanged) {
        var cfloat = parseFloat($('#summary').val());
        var fee = cfloat * 0.0025;
        if (fee > 10) fee = 10;
        if (fee < 0.00000001) fee = 0.00000001;
        $('#fee').val(fee.toFixed(8));
        $("#payment-button-amount").text("Send " + cfloat.toFixed(2));
    }

});
getArionumBalance(function(data) {
    updateMaxValue();
});

function updateMaxValue() {
    var currentValue = parseFloat(localStorage.getItem("lastBalance"));
    var fee = currentValue * 0.0025;
    if (fee > 10) fee = 10;
    if (fee < 0.00000001) fee = 0.00000001;
    var maxvalue = currentValue - fee;
    $("#maxvalue").text("Max: " + maxvalue.toFixed(8));
}
updateMaxValue();



$("#send-button").click(function() {
    $("#dialoguePopup").modal();
    $("#dialoguetitle").text("Arionum Transaction");
    $("#modal-body").html("<p>Working....</p>");
    var address = $("#address").val();
    var message = $("#message").val();
    var amount = parseFloat($("#summary").val()).toFixed(8);
    var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
    var time = parseInt(timeStampInMs / 1000);
    var fee = parseFloat($("#fee").val()).toFixed(8);
    var key = aro.decodeKeypair("arionum:" + privatekey + ":" + publickey);
    var version = address.length < 26 ? 2 : 1;

    if (version == 2) {
        address = address.toUpperCase();
    }

    var presignedmessage = amount + "-" + fee + "-" + address + "-" + message + "-" + version + "-" + publickey + "-" + time;
    console.log("PRESIGN: " + presignedmessage);
    $("#modal-body").html("<p>Signing Message....</p>");
    var signature = aro.sign(key.key, presignedmessage);
    console.log("SIGNATURE: " + signature);

    console.log("VERIFING: .........");

    // http://wallet.arionum.com/api.php?q=checkSignature&signature=asda&public_key=asdasdas&data=asdasdas



    $("#modal-body").html("<p>Sending Transaction....</p>");



    sendTransaction(address, amount, signature, publickey, version, message, time, function(data) {
        console.log(data);
        var status = data.status;
        if (status == "ok") {
            $("#modal-body").html("<h1>Hurray! Everything seems fine</h1><br><p>Your transaction has been sent and is on its way to the receiver!<br> ID: " + data.data + "</p>");
        } else {
            $("#modal-body").html("<h1>Oh no! There was an error</h1><br><p>Your transaction has been canceled :C. Here's the reason why:<br><p style='color:red'>" + data.data + "</p></p>");
        }
        $("#dialoguePopup").modal();
    });

});


$("#generate-button").click(function() {
    $("#dialoguePopup").modal();
    $("#dialoguetitle").text("QR Code");
    $("#modal-body").html("<img src='https://cubedpixels.net/qr/generator.php?Value=" + $("#amount").val() + "&Address=" + address + "&Message=" + $("#message1").val() + "'></img>");
    new QRCode(document.getElementById("modal-body"), "arosend|"+ $("#amount").val()+"|"+address+ "|"+$("#message1").val());
});


$("#copy-button").click(function() {
    $("#own_address").val($("#own_address").val()).select();
    document.execCommand("copy");
});

$("#create-alias-button").click(function() {
    //TODO -> CREATE ALIAS dialoguePopup

});



//
