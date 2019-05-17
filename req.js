const http = require('http');
const qs = require('querystring')
function array_sort_test() {
    const options = {
    hostname: '127.0.0.1',
     port: 9000,
     path: '/api/sort',
     method: 'POST'
     };
    arr = [1,5,7,5,3,4,6,6,3,5,6,7,4,4,8,9,4,2,0,2,34];
    arr_p = JSON.stringify({array:arr,uniq:true});
    const req = http.request(options,(res) => {
	data = '';
	res.on('data', (part) => {
	    data+=part;
	});
	res.on('end', () => {
	    console.log(data);
	});

    });
    req.write(arr_p);
    req.end();
}
function now_test() {
    const options = {
    hostname: '127.0.0.1',
     port: 9000,
     path: '/api/now',
     method: 'GET'
     };
    const req = http.request(options,(res) => {
	data = '';
	res.on('data', (part) => {
	    data+=part;
	});
	res.on('end', () => {
	    console.log(data);
	});

    });
    
    req.end();
}
function weather_test() {
    path = '/api/weather?'+qs.stringify({city:'Taganrog'});
    const options = {
	hostname: '127.0.0.1',
	port: 9000,
	path: path,
	method: 'GET'
     };
    const req = http.request(options,(res) => {
	data = '';
	res.on('data', (part) => {
	    data+=part;
	});
	res.on('end', () => {
	    console.log(data);
	});

    });
    
    req.end();
}
array_sort_test();
now_test();
weather_test();
