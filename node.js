const http = require('http');
const url = require('url');
const qs = require('querystring')
const hostname = '127.0.0.1';
const port = 9000;
weatherApiId = '5979b19f720318a810fbb9ce0b62f329';

const server = http.createServer((req, res) => {
    let parsedUrl = url.parse(req.url);
    let path = parsedUrl.pathname;
    let data = '';
    req.on('data', function (part) {
	data += part;
    });
    
    res.setHeader('Content-Type', 'text/plain');
    if (path == '/api/now') {
	res.statusCode = 200;
	res.end(Date());
    }
    else if (path == '/api/sort' &&  req.method == 'POST') {
	req.on('end', function() {
	    try{
		bodyParsed = JSON.parse(data);
	    }
	    catch(e) {
		res.statusCode = 400;
		res.end('Wrong format of json object.');
		return;
	    }
	    if (! 'array' in bodyParsed) {
		res.statusCode = 400;
		res.end('There isn\'t array in request.');
		return;
	    }
	    array = bodyParsed.array;
	    if  (array.length == 0 ||  array.length > 100) {
		res.statusCode = 400;
		res.end('Length of array is not in [1,100].');
		return;
	    }
	    uniq = false;
	    if ( 'uniq' in bodyParsed && bodyParsed.uniq)
		uniq = true;
	    array = process_arr(array, uniq);
	    res.statusCode = 200;
	    res.end(JSON.stringify(array));
	});

    }
    else if (path == '/api/weather') {
	query = qs.parse(parsedUrl.query)
	if (parsedUrl.query == null || ! 'city' in query || query.city == '') {
	    res.statusCode = 400;
	    res.end('City was not specified.');
	    return;
	}
	else {
	    get_temp(query.city, function(temp) {
		if (temp == '') {
		    res.statusCode = 404;
		    res.end('No information about this city');
		}
		else {
		    res.statusCode = 200;
		    res.end('Temperature in '+ query.city +' is '+temp+' F.');
		}
	    });
	    
	}
    }
    else {
	res.statusCode = 404;
	res.end('There is not such page.');
    }
	
		
		    
    console.log(url.parse(req.url));
    console.log(req.method);


});

function get_temp(cityName, callback) {
    
    params = qs.stringify({q: cityName, APPID: weatherApiId});
    weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?'+params;
    http.get(weatherUrl, function(response) {
	var data = '';
	response.on('data', function(part) {
	    data += part;
	});
	response.on('end', function() {
	   
	    weatherData = JSON.parse(data);
	    
	    temp = '';
	    if (weatherData.cod == 200)
		temp = String(weatherData.main.temp);
	    else
		temp = '';
	    callback(temp);
	});
    });
}
			
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
	
function process_arr(array, uniq) {
     array.sort(function (a,b) {
	 if (a < b)
	     return -1;
	 else if (a > b)
	     return 1;
	 else return 0;
     });
    if (uniq) {
	uniq_array = [array[0]];
	
	previous = array[0];
	for (var i = 1; i < array.length; i++) {
	    if (array[i] != previous)
		uniq_array.push(array[i]);
	    previous = array[i];
	}
	array = uniq_array;
    }
    return array
}
    

