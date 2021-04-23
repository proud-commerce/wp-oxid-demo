(function() {
    // your page initialization code here
    // the DOM will be available here
    console.log('wp-oxid-main ready!');
    let basketComponent = document.getElementById('wp-oxid-basket');
    basketComponent.addEventListener("updatebasket", function (e) {
        console.log('listend to updatebasket event');
        console.log(e);
    });    
    console.log('Adding event listener to basket component ...', basketComponent);
    window.basketComponent = basketComponent;
 })();