const http = require('http');
const url = require('url');
const fs = require('fs');

const hostname = 'localhost'; 
const port = 3000;
const data2 = [];

// Read data from CSV file into memory
fs.readFile('LE.txt', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const decoded = new TextDecoder('windows-1252').decode(data)


  const lines = decoded.split("\n");
  let data1 = [];
  for(let i = 0; i < 108866; i++) {
    data1.push(lines[i].split("\t"));
  }

  data1.forEach((element) => {
    for(let i = 0; i < element.length; i++){
        element[i] = element[i].replaceAll('"', "");
    }

    // making object
    const part = {
        serialNumber: element[0],
        name: element[1],
        storage1: element[2],
        storage2: element[3],
        storage3: element[4],
        storage4: element[5],
        storage5: element[6],
        unknown: element[7],
        price: element[8],
        type: element[9],
        priceWithVAT: element[10]
    };

    data2.push(part);
  });
  console.log(data2);
});

 
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
  
    // Parse the URL to get query parameters
    const parsedUrl = url.parse(req.url, true);
  
    if (parsedUrl.pathname === '/spare-parts') {
      // Check if 'name' or 'sn' query parameters are provided
      const nameQuery = parsedUrl.query.name;
      const snQuery = parsedUrl.query.sn;
      const page = parseInt(parsedUrl.query.page) || 1;
      const sort = parsedUrl.query.sort;

      let filteredData = [...data2];
      if (nameQuery) {
        // Filter by name
        filteredData = filteredData.filter(part => part.name.includes(nameQuery));
      }
  
      if (snQuery) {
        // Filter by serial number
        filteredData = filteredData.filter(part => part.serialNumber.includes(snQuery));
      }
  
      if (sort) {
        // Sorting logic
        if (sort.startsWith('-')) {
          // Sort in reverse order
          const column = sort.slice(1);
          filteredData.sort((a, b) => b[column] - a[column]);
        } else {
          // Sort in ascending order
          filteredData.sort((a, b) => a[sort] - b[sort]);
        }
      }
  
      // Pagination
      const perPage = 30;
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
  
      res.statusCode = 200;
      res.end(JSON.stringify(paginatedData));
    } else {
      // Invalid endpoint
      res.statusCode = 404;
      res.end('Not Found');
    }
  });
  
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });