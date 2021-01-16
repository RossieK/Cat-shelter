const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const breeds = require('../data/breeds.json');
const cats = require('../data/cats.json');

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname === '/cats/add-cat' && req.method === 'GET') {

        const filePath = path.normalize(
            path.join(__dirname, '../views/addCat.html')
        );

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404, Not Found!');
                res.end();
                return;
            }

            let catBreedPlaceholder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);
            let modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceholder);
            console.log(modifiedData);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(modifiedData);
            res.end();

        })

    } else if (pathname === '/cats/add-cat' && req.method === 'POST') {

        let form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {

            if (err) {
                console.error(err);
                return;
            }

            let oldPath = files.upload.path;
            let newPath = path.normalize(path.join(__dirname.toString().replace('handlers', ''), '/content/images/' + files.upload.name));

            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(`Image successfully uploaded to ${newPath}!`);
            });

            fs.readFile('./data/cats.json', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }

                const allCats = JSON.parse(data);
                allCats.push({ id: (cats.length + 1).toString(), ...fields, image: files.upload.name });
                const json = JSON.stringify(allCats);

                fs.writeFile('./data/cats.json', json, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('New cat successfully added!');
                })
            });

            res.writeHead(301, { 'location': '/' });
            res.end();
        });

    } else if (pathname === '/cats/add-breed' && req.method === 'GET') {

        const filePath = path.normalize(path.join(__dirname, '../views/addBreed.html'));

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404, Not Found!');
                res.end();
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });


    } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
        let formData = '';
        req.on('data', data => {
            formData += data;
        });

        req.on('end', () => {
            const body = qs.parse(formData);

            fs.readFile('./data/breeds.json', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }

                let breeds = JSON.parse(data);
                breeds.push(body.breed);
                const json = JSON.stringify(breeds);

                fs.writeFile('./data/breeds.json', json, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    console.log(`${body.breed} breed was successfully added to the breeds database!`);
                });
            });
        });

        res.writeHead(301, { 'location': '/' });
        res.end();

    } else if (pathname.includes('/cats-edit') && req.method === 'GET') {

        const filePath = path.normalize(path.join(__dirname, '../views/editCat.html'));

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404, Not Found!');
                res.end();
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    } else {
        return true;
    }
}