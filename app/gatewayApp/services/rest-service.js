/**
 * Created by Kenny on 4/05/2016.
 */

function createJSON($http) {
    alert("test");
    $http.get('http://localhost:3000/gateway/get/settings').
    success(function(data) {
        alert("GELUKT");
        //$scope.greeting = data;
    });
}

function testPost()
{
    alert("testpost");
}

function getCloudConfig($http)
{

}