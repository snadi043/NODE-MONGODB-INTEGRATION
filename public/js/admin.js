// This is the file while is the initial step to be used as an alternative to the regular version of handling the HTTP request in the node application.
// The reason to switch or look for an alternative here is that, this solution can reduce the work behind the seens for simple works like deleting the items from the page.
// This can be achieved by making few changes in the routes, controllers and a new js file which handles the new version of HTTP request using modern javascript and DOM methods.

// function for deleting the products from the page.
const deleteProduct = (btn) => {
    const productId = document.getElementById('productId').value;
    const csrf = document.getElementById('_csrf').value;

    const productElement = document.querySelector('article');
    const element = productElement.toString().indexOf('1');
    console.log(element);

    // FETCH() -> is not only a "GET" request method but also a method which accepts a URL and overload where we can specify the HTTP verb/methods (like POST, DELETE) to handle the respective actions provided by the browser.
    // FETCH() then provides with a promise to handle the responses and also catches errors if anything goes wrong during the procedure.
    fetch('/admin/product/' + productId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf 
        }
    })
    .then(result => {
        return result.json(); 
    })
    .then(data => {
        console.log(data);
            element.removeChild(element);
        })
    .catch(err => {
        console.log(err);
    });
};